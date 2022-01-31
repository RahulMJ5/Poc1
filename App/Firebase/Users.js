import Firebase from './firebaseConfig';

export const AddUser = async (name, email, contact , uid) => {
    try {
        return await Firebase
            .database()
            .ref("users/" + uid).
            set({
                name: name,
                contact: contact,
                email: email,
                uuid: uid,
            });
    } catch (error) {  
        return error;
    }
}
 
