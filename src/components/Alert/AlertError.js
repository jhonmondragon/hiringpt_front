import Swal from 'sweetalert2'; // libreria de errores

const AlertError = (title, message) => {
    Swal.fire({
        title: title,
        text: message,
        icon: 'error'
    })
}
export default AlertError