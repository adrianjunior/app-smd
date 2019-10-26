import app from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'

class Firebase {
  constructor() {
    // Persistência de Dados
    app.firestore().settings({ persistence: true })

    // Auth
    this.auth = app.auth();
    // Database
    this.firestore = app.firestore();
  }

  /* AUTH */

  // LOGIN
  signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password) 

  // LOGOUT
  signOut = () => this.auth.signOut()

  // ENVIAR EMAIL PARA RESETAR A SENHA
  resetPassword = email => this.auth.sendPasswordResetEmail(email)

  // SABER SE ALGUÉM ESTÁ LOGADO
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

  // CHECA SE O USUÁRIO LOGADO É ADMIN
  checkAdmin = () => this.firestore.collection('admins').doc(this.auth.currentUser.uid)

  /* AULAS */

  // GET DE UMA AULA ESPECÍFICA
  getLesson = lessonId => this.firestore.collection('lessons').doc(lessonId)

  // GET DE TODAS AS AULAS
  getLessons = () => this.firestore.collection('lessons').orderBy("startTime")

  /* EMPRÉSTIMOS */

  // ADICIONA O EMPRÉSTIMO DE UMA CHAVE
  addKeyLoan = loan => this.firestore.collection('keyLoans').add(loan)

  // ADICIONA O EMPRÉSTIMO DE UM RECURSO
  addResourceLoan = loan => this.firestore.collection('resourceLoans').add(loan)

  // ATUALIZA O EMPRÉSTIMO DE UMA CHAVE, ADICIONANDO A HORA DE DEVOLUÇÃO
  updateKeyLoan = (loanId, now) => this.firestore.collection('keyLoans').doc(loanId).update({
    devolutionTime: now
  })

  // ATUALIZA O EMPRÉSTIMO DE UM RECURSO, ADICIONANDO A HORA DE DEVOLUÇÃO
  updateResourceLoan = (loanId, now) => this.firestore.collection('resourceLoans').doc(loanId).update({
    devolutionTime: now
  })

  // GET DE TODOS OS EMPRÉSTIMOS DE CHAVES
  getKeyLoans = () => this.firestore.collection('keyLoans').orderBy("timestamp", "desc")
  
  // GET DE TODOS OS EMPRÉSTIMOS DE RECURSOS
  getResourceLoans = () => this.firestore.collection('resourceLoans').orderBy("timestamp", "desc")

  /* SOLICITAÇÕES DE EMPRÉSTIMOS */
  
  // ADICIONA UMA SOLICITAÇÃO DE EMPRÉSTIMO DE UMA CHAVE
  addKeyRequest = (request, place) => this.firestore.collection(place+'KeyRequests').add(request)

  // ADICIONA UMA SOLICITAÇÃO DE EMPRÉSTIMO DE UM RECURSO
  addResourceRequest = (request, place) => this.firestore.collection(place+'ResourceRequests').add(request)

  // APAGA UMA SOLICITAÇÃO DE EMPRÉSTIMO DE UMA CHAVE QUANDO ELA FOI ACEITA OU NEGADA
  deleteKeyRequest = (requestId, place)  => this.firestore.collection(place+'KeyRequests').doc(requestId).delete()

  // APAGA UMA SOLICITAÇÃO DE EMPRÉSTIMO DE UM RECURSOS QUANDO ELA FOI ACEITA OU NEGADA
  deleteResourceRequest = (requestId, place)  => this.firestore.collection(place+'ResourceRequests').doc(requestId).delete()

  // GET DE UMA SOLICITAÇÃO DE EMPRÉSTIMO DE UMA CHAVE
  getKeyRequest = (requestId, place)  => this.firestore.collection(place+'KeyRequests').doc(requestId)

  // GET DE UMA SOLICITAÇÃO DE EMPRÉSTIMO DE UM RECURSO
  getResourceRequest = (requestId, place)  => this.firestore.collection(place+'ResourceRequests').doc(requestId)

  // GET DE TODAS AS SOLICITAÇÕES DE EMPRÉSTIMO DE CHAVES
  getKeyRequests = place => this.firestore.collection(place+'KeyRequests').orderBy("timestamp", "desc")

  // GET DE TODAS AS SOLICITAÇÕES DE EMPRÉSTIMO DE RECURSOS
  getResourceRequests = place => this.firestore.collection(place+'ResourceRequests').orderBy("timestamp", "desc")

  /* SOLICITAÇÕES DE TROCA ENTRE USUÁRIOS */

  // ADICIONA UMA SOLICITAÇÃO DE TROCA DE UMA CHAVE ENTRE USUÁRIOS
  addKeyRequestToUser = (request, userId) => this.firestore.collection('users').doc(userId).collection('keyRequests').add(request)

  // ADICIONA UMA SOLICITAÇÃO DE TROCA DE UMA CHAVE ENTRE RECURSOS
  addResourceRequestToUser = (request, userId) => this.firestore.collection('users').doc(userId).collection('resourceRequests').add(request)

  // TROCA DE CHAVES ENTRE USUÁRIO
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

  // TROCA DE RECURSOS ENTRE USUÁRIO
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

  // APAGA UMA SOLICITAÇÃO DE TROCA DE CHAVE ENTRE USUÁRIOS DE UM USUÁRIO ESPECIFICO QUANDO ELA FOI ACEITA OU NEGADA
  deleteKeyRequestToUser = (requestId, userId) => this.firestore.collection('users').doc(userId).collection('keyRequests').doc(requestId).delete()

  // APAGA UMA SOLICITAÇÃO DE TROCA DE RECURSO ENTRE USUÁRIOS DE UM USUÁRIO ESPECIFICO QUANDO ELA FOI ACEITA OU NEGADA
  deleteResourceRequestToUser = (requestId, userId) => this.firestore.collection('users').doc(userId).collection('resourceRequests').doc(requestId).delete()

  // GET UMA SOLICITAÇÃO DE TROCA DE CHAVE ENTRE USUÁRIOS DE UM USUÁRIO ESPECIFICO
  getKeyRequestToUser = (requestId, userId)  => this.firestore.collection('users').doc(userId).collection('keyRequests').doc(requestId)

  // GET UMA SOLICITAÇÃO DE TROCA DE RECURSO ENTRE USUÁRIOS DE UM USUÁRIO ESPECIFICO
  getResourceRequestToUser = (requestId, userId)  => this.firestore.collection('users').doc(userId).collection('resourceRequests').doc(requestId)

  // GET TODAS AS SOLICITAÇÕES DE TROCA DE CHAVE ENTRE USUÁRIOS DE UM USUÁRIO ESPECIFICO
  getKeyRequestsToUser = userId  => this.firestore.collection('users').doc(userId).collection('keyRequests')

  // GET TODAS AS SOLICITAÇÕES DE TROCA DE RECURSO ENTRE USUÁRIOS QUANDO ELA FOI ACEITA OU NEGADA
  getResourceRequestsToUser = userId  => this.firestore.collection('users').doc(userId).collection('resourceRequests')

  /* USUÁRIOS */

  // GET O USUÁRIO ATUAL
  getUser = () => this.firestore.collection('users').doc(this.auth.currentUser.uid)

  /* RECURSOS */

  // GET TODOS OS RECURSOS
  getResources = () => this.firestore.collection('resources').orderBy("name")

  // ATUALIZA UM RECURSO DESTRUTIVAMENTE
  updateResource = resource =>
    this.firestore.collection('resources').doc(resource.id).set({
        name: resource.name,
        place: resource.place,
        status: resource.status,
        user: resource.user,
        userId: resource.userId
    })

  // ATUALIZA UM RECURSO NÃO DESTRUTIVAMENTE
  updateResourceWithOutUser = resource =>
    this.firestore.collection('resources').doc(resource.id).update({
      name: resource.name,
      place: resource.place,
      status: resource.status
    })
  
  // ATUALIZA UM RECURSO NÃO DESTRUTIVAMENTE (DEVOLUÇÃO DE RECURSO)
  updateResourceDeletingUser = resourceId =>
    this.firestore.collection('resources').doc(resourceId).update({
      status: true,
      user: app.firestore.FieldValue.delete(),
      userId: app.firestore.FieldValue.delete(),
      loanId: app.firestore.FieldValue.delete()
    })

  /* CHAVES */

  // GET TODOS OS RECURSOS
  getKeys = () => this.firestore.collection('keys').orderBy("name")

  // ATUALIZA UM RECURSO DESTRUTIVAMENTE
  updateKey = key =>
    this.firestore.collection('keys').doc(key.id).set({
      name: key.name,
      place: key.place,
      status: key.status,
      user: key.user,
      userId: key.userId
    })

  // ATUALIZA UM RECURSO NÃO DESTRUTIVAMENTE
  updateKeyWithOutUser = key =>
    this.firestore.collection('keys').doc(key.id).update({
      name: key.name,
      place: key.place,
      status: key.status
    })

  // ATUALIZA UM RECURSO NÃO DESTRUTIVAMENTE (DEVOLUÇÃO DE RECURSO)   
  updateKeyDeletingUser = keyId =>
    this.firestore.collection('keys').doc(keyId).update({
      status: true,
      user: app.firestore.FieldValue.delete(),
      userId: app.firestore.FieldValue.delete(),
      loanId: app.firestore.FieldValue.delete()
    })

  /* ROOMS */

  // GET TODAS AS SALAS
  getRooms = () => this.firestore.collection('rooms').orderBy("name")

  /* PLACES */

  // GET TODOS OS LOCAIS
  getPlaces = () => this.firestore.collection('places').orderBy("name")

}

export default Firebase;