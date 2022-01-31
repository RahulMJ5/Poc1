import  { useState, useEffect } from 'react';

export const Load = () => {
    let onEndReachedCalledDuringMomentum = false;

const [isLoading, setIsLoading] = useState(false);
const [isMoreLoading, setIsMoreLoading] = useState(false);
const [lastDoc, setLastDoc] = useState(null);
const [users, setUsers] = useState([]);

const usersRef = firestore().collection('users');

useEffect(() => {
  getUsers();
}, []);

getUsers = async () => {
  setIsLoading(true);

  const snapshot = await usersRef.orderBy('id').limit(5).get();

  if (!snapshot.empty) {
    let newUsers = [];

    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

    for (let i = 0; i < snapshot.docs.length; i++) {
      newUsers.push(snapshot.docs[i].data());
    }

    setUsers(newUsers);
  } else {
    setLastDoc(null);
  }

  setIsLoading(false);
}

getMore = async () => {
  if (lastDoc) {
    setIsMoreLoading(true);

    setTimeout(async() => {
    let snapshot = await usersRef.orderBy('id').startAfter(lastDoc.data().id).limit(5).get();

    if (!snapshot.empty) {
      let newUsers = users;

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      for(let i = 0; i < snapshot.docs.length; i++) {
        newUsers.push(snapshot.docs[i].data());
      }

      setUsers(newUsers);
      if (snapshot.docs.length < 3) setLastDoc(null);
    } else {
      setLastDoc(null);
    }

    setIsMoreLoading(false);
  }, 1000);
  }

  onEndReachedCalledDuringMomentum = true;
}
}