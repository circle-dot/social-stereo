import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// Using Tailwind CSS custom colors from config
const colors = {
    lightGreen: '#B9FE5E', // custom.lightGreen
    darkPurple: '#390892', // custom.darkPurple 
    white: '#FFFFFF', // custom.white
    error: '#dc2626', // Keeping Tailwind red-600 for error state
}

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
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: message,
        background: colors.darkPurple,
        color: colors.white,
        confirmButtonColor: colors.error,
    });
};

export const showSuccessAlert = (message: string, confirmText: string, redirectUrl: string) => {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: 'Close',
        cancelButtonColor: colors.error,
        confirmButtonColor: colors.lightGreen,
        background: colors.darkPurple,
        color: colors.white,
    }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {
            window.open(redirectUrl, '_blank');
        }
    });
};

export const showOnlySucessWithRedirect = (message: string, confirmText: string, redirectUrl: string) => {
    Swal.fire({
        title: "Zupass connected!",
        text: message,
        confirmButtonText: confirmText,
        confirmButtonColor: colors.lightGreen,
        allowOutsideClick: false,
        background: colors.darkPurple,
        color: colors.white,
        icon: "success"
    }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {
            window.location.href = redirectUrl;
        }
    });
};

export const showCopySuccessAlert = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: colors.darkPurple,
        color: colors.white,
        didOpen: (toast: { addEventListener: (arg0: string, arg1: any) => void; }) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Address copied to clipboard'
    })
}

export const showErrorAlertWithSpace = (title: string, message: string) => {
    Swal.fire({
        icon: 'error',
        title: title,
        html: message.replace(/\n/g, '<br>'),
        background: colors.darkPurple,
        color: colors.white,
        confirmButtonColor: colors.error,
    });
};

export const showSuccessAlertWithoutRedirect = (message: string, confirmText: string = 'OK') => {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        confirmButtonText: confirmText,
        confirmButtonColor: colors.lightGreen,
        background: colors.darkPurple,
        color: colors.white,
    });
};