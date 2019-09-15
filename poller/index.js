const admin = require('firebase-admin')
const Firestore = require('@google-cloud/firestore');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

/** @type {FirebaseFirestore.Firestore} */
const db = new Firestore({
    projectId: 'civic-depth-252905'
  });

  /**
   * 
   * @param {Date} date 
   * @param {number} days 
   */
  function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }

  const sendMessage = (data, tokens) => {
      
      const message = {
        data,
        tokens,
      }
      
      admin.messaging().sendMulticast(message)
        .then((response) => {
          console.log(response.successCount + ' messages were sent successfully');
        })
}

/** 
 * @param {{repeats:{amount:number,unit:"day"|"week"|"month"}, start:Date}} schedule
*/
const nextDate = (schedule) => {
    const today = new Date()
    const repeatInterval = schedule.repeats.amount
    if(schedule.repeats.unit === "month"){
        repeatInterval *= 30
    } else if(schedule.repeats.unit === "week"){
        repeatInterval *= 7
    }
    if(today.getTime() < schedule.start.getTime()) {
        return schedule.start
    }
        
    const Difference_In_Time = Math.abs(today.getTime() - schedule.start.getTime()); 
    
    // To calculate the no. of days between two dates 
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

    const fullSets =repeatInterval*(Math.floor(Difference_In_Days /repeatInterval)+1)
    return addDays(schedule.start,fullSets)
}

console.log(nextDate({
    repeats:{
        amount:1,
        unit:"day"
    },
    start:addDays(new Date(),-4)
}))
  db.collectionGroup('children').get()
  .then(children => Promise.all(children.docs.map(child => child.ref.collection('Tasks').listDocuments())))
  .then(taskLists => taskLists.reduce((a, b) => a.concat(b), []))
  .then(tasks => Promise.all(tasks.map(task => task.get())))
  .then(tasks => tasks.map(task => {
      const data = task.data()
      /** @type {{repeats:{amount:number,unit:"day"|"week"|"month"}, start:Date}[]} */
      const schedules = data.schedules
      for (const schedule of schedules){
          schedule.start = schedule.start.toDate()
          console.log(schedule)
        const next = nextDate(schedule)
        const diff = new Date().getTime() - next.getTime()
        console.log(next,diff)
        if(diff < 15* 60 * 1000){
            baseMessage = task.data().task
            Promise.all([task.ref.parent.parent.get(),task.ref.parent.parent.parent.parent.get()]).then(([child,parent]) => {
                childTokens = child.data().pushTokens
                parentTokens = parent.data().pushTokens
                sendMessage({msg:"Its time to '"+baseMessage+"'!"},childTokens)
                sendMessage({msg:"We just remined '"+child.data().childDescription+"' to '"+baseMessage+"'"},parentTokens)
                db.collection('notifications').add({
                    task:baseMessage,
                    confirmed:false,
                    ignored:false,
                    sent:new Date(),       
                    parent:parent.ref.path,
                    child:child.ref.path
                })
            })
            childTokens = task.ref.parent.parent.get()
        }
      }
  }))