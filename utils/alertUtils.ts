import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// Using Tailwind CSS custom colors from config
const colors = {
    lightGreen: '#B9FE5E', // custom.lightGreen
    darkPurple: '#390892', // custom.darkPurple 
    white: '#FFFFFF', // custom.white
    error: '#dc2626', // Keeping Tailwind red-600 for error state
}

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 7000,
    showCloseButton: true,
    timerProgressBar: true,
    background: colors.darkPurple,
    color: colors.white,
    didOpen: (toast: { addEventListener: (arg0: string, arg1: any) => void; }) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const showAlertWithRedirect = async (
    title: string,
    buttonText: string,
    redirectUrl: string,
    isError: boolean = false
) => {
    await Swal.fire({
        icon: isError ? 'error' : 'success',
        title,
        confirmButtonText: buttonText,
        confirmButtonColor: isError ? colors.error : colors.lightGreen,
        background: colors.darkPurple,
        color: colors.white,
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = redirectUrl;
        }
    });
};

export const showLoadingAlert = () => {
    Swal.fire({
        title: 'Processing...',
        text: 'Please wait while your request is being processed.',
        allowOutsideClick: false,
        background: colors.darkPurple,
        color: colors.white,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export const showErrorAlert = (message: string) => {
    Toast.fire({
        icon: 'error',
        title: message
    })
};

export const showSuccessAlert = (message: string, confirmText: string, redirectUrl: string) => {
    Toast.fire({
        icon: 'success',
        title: message
    }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {
            window.open(redirectUrl, '_blank');
        }
    });
};

export const showOnlySucessWithRedirect = (message: string, confirmText: string, redirectUrl: string) => {
    Toast.fire({
        icon: 'success',
        text: message,
        confirmButtonText: confirmText,
    }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {
            window.location.href = redirectUrl;
        }
    });
};

export const showCopySuccessAlert = () => {
    Toast.fire({
        icon: 'success',
        title: 'Address copied to clipboard'
    })
}

export const showErrorAlertWithSpace = (title: string, message: string) => {
    Toast.fire({
        icon: 'error',
        title: title,
        html: message.replace(/\n/g, '<br>'),
    })
};

export const showSuccessAlertWithoutRedirect = (message: string, confirmText: string = 'OK') => {
    Toast.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        confirmButtonText: confirmText,
    })
};