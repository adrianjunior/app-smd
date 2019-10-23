import app from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'

class Firebase {
  constructor() {
    //persistencia de dados
    app.firestore().settings({ persistence: true })

    this.auth = app.auth();
    this.firestore = app.firestore();
  }

  signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password)

  signOut = () => this.auth.signOut()

  resetPassword = email => this.auth.sendPasswordResetEmail(email)

  isLogged = () => {
      let u = false
      this.auth.onAuthStateChanged(user => {
          if(user) {
              u = true
          } else {
              u = false
          }
      })
      return u
  }

  /* ADMIN */

  checkAdmin = () => this.firestore.collection('admins').doc(this.auth.currentUser.uid)

  /* OFFER */

  getLesson = lessonId => this.firestore.collection('lessons').doc(lessonId)

  getDynamicLesson = lessonId => this.firestore.collection('dynamicLessons').doc(lessonId)

  getLessons = () => this.firestore.collection('lessons').orderBy("startTime")

  getDynamicLessons = () => this.firestore.collection('dynamicLessons').orderBy("startTime")

  /* LOAN */

  addKeyLoan = loan => this.firestore.collection('keyLoans').add(loan)

  addResourceLoan = loan => this.firestore.collection('resourceLoans').add(loan)

  updateKeyLoan = (loanId, now) => this.firestore.collection('keyLoans').doc(loanId).update({
    devolutionTime: now
  })

  updateResourceLoan = (loanId, now) => this.firestore.collection('resourceLoans').doc(loanId).update({
    devolutionTime: now
  })

  getKeyLoans = () => this.firestore.collection('keyLoans').orderBy("timestamp", "desc")
  
  getResourceLoans = () => this.firestore.collection('resourceLoans').orderBy("timestamp", "desc")

  /* LOAN REQUESTS */
  
  addKeyRequest = (request, place) => this.firestore.collection(place+'KeyRequests').add(request)

  addResourceRequest = (request, place) => this.firestore.collection(place+'ResourceRequests').add(request)

  deleteKeyRequest = (requestId, place)  => this.firestore.collection(place+'KeyRequests').doc(requestId).delete()

  deleteResourceRequest = (requestId, place)  => this.firestore.collection(place+'ResourceRequests').doc(requestId).delete()

  getKeyRequest = (requestId, place)  => this.firestore.collection(place+'KeyRequests').doc(requestId)

  getResourceRequest = (requestId, place)  => this.firestore.collection(place+'ResourceRequests').doc(requestId)

  getKeyRequests = place => this.firestore.collection(place+'KeyRequests').orderBy("timestamp", "desc")

  getResourceRequests = place => this.firestore.collection(place+'ResourceRequests').orderBy("timestamp", "desc")

  /* LOAN REQUESTS TO USERS */

  addKeyRequestToUser = (request, userId) => this.firestore.collection('users').doc(userId).collection('keyRequests').add(request)

  addResourceRequestToUser = (request, userId) => this.firestore.collection('users').doc(userId).collection('resourceRequests').add(request)

  swapKey = (now, key, requestId, userId) => {
    console.log(userId)
    console.log(requestId)
    //Criar o batch
    const batch = this.firestore.batch();

    //Terminar o empréstimo da pessoa
    const keyLoanRef = this.firestore.collection('keyLoans').doc(key.loanId)
    batch.update(keyLoanRef, {
      devolutionTime: now
    })

    //Alterar a chave
    const keyRef = this.firestore.collection('keys').doc(key.id)
    batch.set(keyRef, {
      name: key.name,
      place: key.place,
      status: key.status,
      user: key.user,
      userId: key.userId
    })

    //Deletar a solicitação
    const rqRef = this.firestore.collection('users').doc(userId).collection('keyRequests').doc(requestId)
    batch.delete(rqRef)

    //Enviar o batch
    return batch.commit()
  }

  swapResource = (now, resource, requestId, userId) => {
    //Criar o batch
    const batch = this.firestore.batch();

    //Terminar o empréstimo da pessoa
    const resourceLoanRef = this.firestore.collection('resourceLoans').doc(resource.loanId)
    batch.update(resourceLoanRef, {
      devolutionTime: now
    })

    //Alterar a chave
    const resourceRef = this.firestore.collection('resources').doc(resource.id)
    batch.set(resourceRef, {
      name: resource.name,
      place: resource.place,
      status: resource.status,
      user: resource.user,
      userId: resource.userId
    })

    //Deletar a solicitação
    const rqRef = this.firestore.collection('users').doc(userId).collection('resourceRequests').doc(requestId)
    batch.delete(rqRef)

    //Enviar o batch
    return batch.commit()
  }

  deleteKeyRequestToUser = (requestId, userId) => this.firestore.collection('users').doc(userId).collection('keyRequests').doc(requestId).delete()

  deleteResourceRequestToUser = (requestId, userId) => this.firestore.collection('users').doc(userId).collection('resourceRequests').doc(requestId).delete()

  getKeyRequestToUser = (requestId, userId)  => this.firestore.collection('users').doc(userId).collection('keyRequests').doc(requestId)

  getResourceRequestToUser = (requestId, userId)  => this.firestore.collection('users').doc(userId).collection('resourceRequests').doc(requestId)

  getKeyRequestsToUser = userId  => this.firestore.collection('users').doc(userId).collection('keyRequests')

  getResourceRequestsToUser = userId  => this.firestore.collection('users').doc(userId).collection('resourceRequests')

  /* USERS */

  getUser = () => this.firestore.collection('users').doc(this.auth.currentUser.uid)

  /* RESOURCES */

  getResources = () => this.firestore.collection('resources').orderBy("name")

  updateResource = resource =>
    this.firestore.collection('resources').doc(resource.id).set({
        name: resource.name,
        place: resource.place,
        status: resource.status,
        user: resource.user,
        userId: resource.userId
    })

  updateResourceWithOutUser = resource =>
    this.firestore.collection('resources').doc(resource.id).update({
      name: resource.name,
      place: resource.place,
      status: resource.status
    })
  
  updateResourceDeletingUser = resourceId =>
    this.firestore.collection('resources').doc(resourceId).update({
      status: true,
      user: app.firestore.FieldValue.delete(),
      userId: app.firestore.FieldValue.delete(),
      loanId: app.firestore.FieldValue.delete()
    })

  /* KEYS */

  getKeys = () => this.firestore.collection('keys').orderBy("name")

  updateKey = key =>
    this.firestore.collection('keys').doc(key.id).set({
      name: key.name,
      place: key.place,
      status: key.status,
      user: key.user,
      userId: key.userId
    })

  updateKeyWithOutUser = key =>
    this.firestore.collection('keys').doc(key.id).update({
      name: key.name,
      place: key.place,
      status: key.status
    })

  updateKeyDeletingUser = keyId =>
    this.firestore.collection('keys').doc(keyId).update({
      status: true,
      user: app.firestore.FieldValue.delete(),
      userId: app.firestore.FieldValue.delete(),
      loanId: app.firestore.FieldValue.delete()
    })

  /* ROOMS */

  getRooms = () => this.firestore.collection('rooms').orderBy("name")

  /* PLACES */

  getPlaces = () => this.firestore.collection('places').orderBy("name")

}

export default Firebase;