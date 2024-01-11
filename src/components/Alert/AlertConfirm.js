import Swal from 'sweetalert2'; // libreria de errores

const AlertConfirm = (title, message) => {
    Swal.fire({
        title: title,
        text: message,
        icon: "success"
    });    
}
export default AlertConfirm


