const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'civic-depth-252905',
  keyFilename: 'C:\Users\jacyg\Documents\My_First_Project-db4d380f990b.json',
});

module.exports = {
    /** 
     * Returns info
     * @param {string} username
     * @returns {Promise<{ username: string, password: string} | false>}
    */
    getUser: async (username) => {
        let userRef = db.collection('users').doc(username);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    return false;
                } else {
                    pass = doc.data()
                    return {username, pass};
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    },
    /** 
     * Returns info for child
     * @param {string} childCode
     * @returns {Promise<{childId: string, parent:{ username: string, password: string}} | false>}
    */
    getChild: async (childCode) => {
        let userRef = db.collection('users')
        let children = userRef.where('type', '==', 'museum');
        children.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, ' => ', doc.data());
            });
        });
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
        return {}
    },
    /**
    * @param {string} username
    * @param {{[prefKey : string]: value}} updates
    * @returns {Promise<boolean>} if update was successfull
    */
    updateUserPreferences: async (username, updates) => {
        return true
    },
    /** 
     * @param {string} username
     * @param {string} childId
    * @param {{[prefKey : string]: value}} updates
     * @returns {Promise<boolean>} if update was successfull
    */
    updateChildPreferences: async (username, childId, updates) => {

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
     *          time: {
     *              hour: number,
     *              minute: number
     *          },
     *         startDate: Date
     *      }[]
     * }[]>}
    */
    getChildTaskSchedules: async (username, childId) => {

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
     *          time: {
     *              hour: number,
     *              minute: number
     *          },
     *         startDate: Date
     *      }[] | false
     * }[]} updates
     * @returns {Promise<boolean>} if the update was successful
     **/
    updateChildTaskSchedules: async (username, childId, updates) => {

    },

}