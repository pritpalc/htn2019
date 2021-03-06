const Firestore = require('@google-cloud/firestore');

/** @type {FirebaseFirestore.Firestore} */
const db = new Firestore({
  projectId: 'civic-depth-252905'
});

module.exports = {
    /** 
     * Returns info
     * @param {string} username
     * @returns {Promise<{ username: string, password: string} | false>}
    */
    getUser: async (username) => {
        return db.collection('users').doc(username).get()
            .then(doc => {
                console.log(doc)
                if (!doc.exists) {
                    return false;
                } else {
                    data = doc.data()
                    password = data.password
                    console.log(username,password)
                    return {username, password};
                }
            })
    },
    /** 
     * Returns info for child
     * @param {string} childCode
     * @returns {Promise<{childId: string, parent:{ username: string, password: string}} | false>}
    */
    getChild: async (childCode) => {
        return db.collectionGroup('children')
            .where("code", "==", childCode)
            .get().then(value => {
                if(!value || value.docs.length === 0) {
                    return false
                }
                const child = value.docs[0]
                return child.ref.parent.parent.get().then(parent => {
                    if(!parent){
                        return false
                    }
                    const data = parent.data()
                    console.log(data)
                    return {
                        childId: child.id,
                        parent: {
                            username: parent.id,
                            password: data.password
                        }
                    }
                })
            })
    },
    /**
     * @param {string} username
     * @returns {Promise<{[prefKey : string]: value}>} Dict of User prefs
     */
    getUserPreferences: async (username) => {
        return {}
    },
    /** 
     * @param {string} username
     * @param {string} childId
     * @returns {Promise<{[prefKey : string]: value}>} Dict of child prefs
    */
    getChildPreferences: async (username, childId) => {
        return db.collection('users').doc(username).collection('children').doc(childId).get().then(child => {
             if(!child) return {}
             data = child.data()
             if(data.prefs) return data.prefs
             return {}
        })
    },
    /**
    * @param {string} username
    * @param {{[prefKey : string]: value}} updates
    * @returns {Promise<boolean>} if update was successfull
    */
    updateUserPreferences: async (username, updates) => {
        return Promise.resolve(true)
    },
    /** 
     * @param {string} username
     * @param {string} childId
    * @param {{[prefKey : string]: value}} updates
     * @returns {Promise<boolean>} if update was successfull
    */
    updateChildPreferences: async (username, childId, updates) => {
        return db.collection('users').doc(username).collection('children').doc(childId).update({prefs:updates}).then(result => {
            return true
        })
    },
    /** 
     * @param {string} username
     * @param {string} childId
     * @returns {Promise<{
     *      taskId: string,
     *      task: string, 
     *      schedules: {
     *          scheduleId: string    
     *          repeats: { 
     *              units:"days" | "weeks" | "months",
     *              amount: number
     *          },
     *         start: Date
     *      }[]
     * }[]>}
    */
    getChildTaskSchedules: async (username, childId) => {
        return db.collection('users').doc(username).collection('children').doc(childId).collection("Tasks").listDocuments().then(tasks => {
            return Promise.all(tasks.map(task => task.get()))
        }).then(tasks => {
            return tasks.map(task => ({taskId:task.id,...task.data()}))
        })
    },

    /** 
     * @param {string} username
     * @param {string} childId
     * @param {{
     *      taskId: string,
     *      task: string, 
     *      schedules: {
     *          scheduleId?: string
     *          repeats: { 
     *              units:"days" | "weeks" | "months",
     *              amount: number
     *          } | false,
     *         start: Date
     *      }[] | false
     * }} updates
     * @returns {Promise<boolean>} if the update was successful
     **/
    updateChildTaskSchedules: async (username, childId, updates) => {
            if(updates.schedules !== false){
                return db.collection('users').doc(username).collection('children').doc(childId).collection('Tasks').doc(updates.taskId).update({task: updates.task, schedules: updates.schedules}).catch(err => {
                    return db.collection('users').doc(username).collection('children').doc(childId).collection('Tasks').add(updates)
                })
            } else {
                return db.collection('users').doc(username).collection('children').doc(childId).collection('Tasks').doc(updates.taskId).delete()
            }
    },

    /**
     * @param {string} username
     */
    getChildren: async (username) => {
        return db.collection('users').doc(username).collection('children').listDocuments().then(children => {
            return Promise.all(children.map(child => child.get()))
        }).then(children => {
            return children.map(child => ({...child.data(),childId:child.id}))
        })
    },

    /**
     * @param {string} username
     * @param {string} token
     */
    registerPushToken: async(username, token) => {
        return db.collection('users').doc(username).update('pushTokens', Firestore.FieldValue.arrayUnion(token))
    },

    /**
     * @param {string} username
     * @param {string} token
     */
    registerChildPushToken: async(username, childId, token) => {
        return db.collection('users').doc(username).collection('children').doc(childId).update('pushTokens', Firestore.FieldValue.arrayUnion(token))
    },

    /**
     * @param {string} username
    * @param {{[prefKey : string]: value}} prefs
    * @param {string} code
    * @param {string} childDescription
    * @param { {task: string, 
     *      schedules: {
        *          scheduleId?: string
        *          repeats: { 
        *              units:"days" | "weeks" | "months",
        *              amount: number
        *          },
        *         start: Date
        *      }[]}[]} tasks
     */
    newChild: async(username, prefs, code, childDescription, tasks) => {
        tasks = tasks.map(task => ({...task, schedules: task.schedules.map(schedule => ({...schedule, start:new Firestore.Timestamp(schedule.start,0)}))}))
        return db.collection('users').doc(username).collection('children').add({
            code,
            prefs,
            childDescription,
            character:{
                characterDefinition:{}
            },
            pushTokens:[],
            tknBalance:0})
        .then(child => Promise.all(tasks.map(task => child.collection("Tasks").add(task))).then(() => child.get()))
        .then(child => ({...child.data(),childId:child.id}))
    },

    /**
     * @param {string} username
     * @param {string} childId
     * @param {string} childDescription
     */
    setChildDescription: async(username, childId, childDescription) => {
        return db.collection('users').doc(username).collection('children').doc(childId).update({childDescription})
    },
    /**
     * @param {string} username
     * @param {string} childId
     */
    getChildCharacter: async(username, childId) => {
        return db.collection('users').doc(username).collection('children').doc(childId).get().then(child => child.data()).then(data => data.character)
    },

    /**
     * @param {string} username
     * @param {string} childId
     * @param {{[prefKey : string]: value}} character
     */
    setChildCharacter: async(username,childId,character) => {
        return db.collection('users').doc(username).collection('children').doc(childId).update({character})
    },

    /**
     * @param {string} username
     * @param {string} childId
     */
    getChildNotifications: async(username,childId) => {
        childPath = ["users",username,"children",childId].join("/")
        return db.collection('notifications')
                        .where("child", "==", childPath).get()
                        .then(notifications =>  notifications.docs)
                        .then(notifications => notifications.map(notification => ({notificationId:notification.id, ...notification.data()})))
    },
    
    /**
    * @param {string} username
    */
   getUserNotifications: async(username) => {
       parentPath = ["users",username].join("/")
       return db.collection('notifications')
                       .where("parent", "==", parentPath).get()
                       .then(notifications =>  notifications.docs)
                       .then(notifications => notifications.map(notification =>  ({notificationId:notification.id, ...notification.data()})))
   },

   /** 
    * @param {string} notificationId
   */
   confirmNotification: async(notificationId) => {
       return db.collection('notifications').doc(notificationId).update({confirmed:true})
   },

   /** 
    * @param {string} notificationId
   */
   ignoreNotification: async(notificationId) => {
       return db.collection('notifications').doc(notificationId).update({ignored:true})
   }




}