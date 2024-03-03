const dev = {
  apiUrl: "http://127.0.0.1:8000/",
  registerUrl: "register/", //registra un usuario
  loginUrl: "login/", // permmite logear un usuario

  listUsersCompanyUrl: "user/list/all",
  changeUserRole: "user/change/role", // Cambiar el rol de un usuario
  deleteUserCompany: "user/delete_user_company", // Eliminar un usuario de una compañia


  listQuestionCategoryUrl: "question/list/category", //trae todas las categorias de preguntas
  createQuestionCategoryUrl: "question/create/category", // crea categorias
  listQuestionsByCategory: "question/list/questions/", //lista todas preguntas por categoria
  listAllquestionsUrl: "question/list/questions", //lista todas las preguntas
  createQuestion: "question/create/question", //crea preguntas
  deleteQuestion: "question/delete/questions/", // elimina preguntas
  deleteCategory: "question/delete/categorys/", // elimina ccategorias de preguntas y sus preguntas vinculadas
  
  
  listInterviewsUrl: "interview/list/interview", // lista todas las entrevistas
  infoInterviewUrl: "interview/interview/", // trae toda la info de la entrevista
  createInterviewUrl: "interview/create/interview", // crea la entrevista
  deleteInterviewUrl: "interview/delete_interview/", // elimina la entrevista
  updateInterviewUrl: "interview/update/interview", // actualiza la entrevista


  listAllProcess: "process/list/process", //listar proceso
  listInfoProcessUrl: "process/list/process/", //listar informacion del proceso
  createProcess: "process/create/process", // crear proces
  deleteProcess: "process/delete_process/", //eliminar proceso
  updateProcessUrl: "process/update_process", // actualizar informacion del proceso


  createBulkCandidatesUrl: "candidate/create_bulk", // crear varios candidatos a partir del excel
  createCandidateUrl: "candidate/create",
  listAllCandidatesUrl: "candidate/list",
  listProcessCandidatesUrl: "candidate/list/", //trae los candidatos del proceso
  deleteCandidateUrl: "candidate/delete/",


  deploymentUrl: "deployment/create", //URL para hacer despliegues
  infoDeploymentInterviewUrl: "deployment/get_info/", // info de la entrevista que presentara el candidato

  postResponseInterviewUrl: "core/upload_video",

  getInfoResponseProcessUrl: "analytics/info_response_process/",
  getInfoPercentStatusProcessUrl: "analytics/info_percent_status_process/",

  getCalculateFoundsUrl: "credit/calculate_founds",
  listDiscountsUrl: "credit/list_discounts",
  discountsMontUrl: 'credit/total_discounts_month',

  invitationUser: "invitation_user/", // Permite enviar invitaciones a un usuario
  get_invitation_user: "invitation_user/get_info_invitation/", // Permite traer la informacion de la invitacion
  novelty_invitation: "invitation_user/novelty_invitation/" // permite aceptar o rechazar la invitacion


};
  
const prod = {
  apiUrl: "https://api.hiringpt.com/",
  registerUrl: "register/", //registra un usuario
  loginUrl: "login/", // permmite logear un usuario

  listUsersCompanyUrl: "user/list/all",
  changeUserRole: "user/change/role", // Cambiar el rol de un usuario
  deleteUserCompany: "user/delete_user_company", // Eliminar un usuario de una compañia


  listQuestionCategoryUrl: "question/list/category", //trae todas las categorias de preguntas
  createQuestionCategoryUrl: "question/create/category", // crea categorias
  listQuestionsByCategory: "question/list/questions/", //lista todas preguntas por categoria
  listAllquestionsUrl: "question/list/questions", //lista todas las preguntas
  createQuestion: "question/create/question", //crea preguntas
  deleteQuestion: "question/delete/questions/", // elimina preguntas
  deleteCategory: "question/delete/categorys/", // elimina ccategorias de preguntas y sus preguntas vinculadas
  
  
  listInterviewsUrl: "interview/list/interview", // lista todas las entrevistas
  infoInterviewUrl: "interview/interview/", // trae toda la info de la entrevista
  createInterviewUrl: "interview/create/interview", // crea la entrevista
  deleteInterviewUrl: "interview/delete_interview/", // elimina la entrevista
  updateInterviewUrl: "interview/update/interview", // actualiza la entrevista


  listAllProcess: "process/list/process", //listar proceso
  listInfoProcessUrl: "process/list/process/", //listar informacion del proceso
  createProcess: "process/create/process", // crear proces
  deleteProcess: "process/delete_process/", //eliminar proceso
  updateProcessUrl: "process/update_process", // actualizar informacion del proceso


  createBulkCandidatesUrl: "candidate/create_bulk", // crear varios candidatos a partir del excel
  createCandidateUrl: "candidate/create",
  listAllCandidatesUrl: "candidate/list",
  listProcessCandidatesUrl: "candidate/list/", //trae los candidatos del proceso
  deleteCandidateUrl: "candidate/delete/",


  deploymentUrl: "deployment/create", //URL para hacer despliegues
  infoDeploymentInterviewUrl: "deployment/get_info/", // info de la entrevista que presentara el candidato

  postResponseInterviewUrl: "core/upload_video",

  getInfoResponseProcessUrl: "analytics/info_response_process/",
  getInfoPercentStatusProcessUrl: "analytics/info_percent_status_process/",

  getCalculateFoundsUrl: "credit/calculate_founds",
  listDiscountsUrl: "credit/list_discounts",
  discountsMontUrl: 'credit/total_discounts_month',

  invitationUser: "invitation_user/", // Permite enviar invitaciones a un usuario
  get_invitation_user: "invitation_user/get_info_invitation/", // Permite traer la informacion de la invitacion
  novelty_invitation: "invitation_user/novelty_invitation/" // permite aceptar o rechazar la invitacion

};
  
  export const config = process.env.NODE_ENV === "production" ? prod : dev;
  

  