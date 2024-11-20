const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();

async function storeData(id, data) {
    const predictCollection = db.collection('predictions');
    return predictCollection.doc(id).set(data);
}

async function getHistories() {
    const predictCollection = db.collection('predictions');
    try {
        const snapshot = await predictCollection.get();
        if (snapshot.empty) {
            return { 
                status: 'success', 
                data: [], 
                message: "History empty" };
        }

        const histories = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                result: data.result,
                suggestion: data.suggestion,
                createdAt: data.createdAt,
            };
        });

        return { 
            status: 'success', 
            data: histories 
        };

    } catch (error) {
        console.error("Error retrieving prediction histories:", error);
        return { 
            status: 'fail', 
            message: 'Failed to retrieve prediction histories' 
        };
    }
}

module.exports = { storeData, getHistories };