import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private auth:Auth, private firestorage: Firestore, private storage: Storage) { }

  getUserProfile(){
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestorage, `users/${user!.uid}`);
    return docData(userDocRef, { idField: 'id' });
  }

  async uploadImage(photo: Photo){
    const user = this.auth.currentUser;
    const path = `uploads/${user!.uid}/avatar.jpg`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, photo.base64String!, 'data_url');
      const url = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestorage, `users/${user!.uid}`);
      await setDoc(userDocRef, {avatar: url}, {merge: true});
      return true;
    } catch (error) {
      return false;
    }
  }
}
