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
    },
    customClass: {
        loader: 'custom-loader'
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

export const showZupassWarningAlert = async (params: { org: string }) => {
    Toast.fire({
        icon: 'warning',
        title: 'Zupass Required',
        text: 'You need to verify your Zupass before voting. Would you like to do that now?',
        showCancelButton: true,
        confirmButtonText: 'Yes, verify Zupass',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `/${params.org}/login`;
        }
    });
};

export const showLoadingAlert = (title: string, text: string) => {
    Swal.fire({
        title: title,
        text: text,
        allowOutsideClick: true,
        allowEscapeKey: true,
        showCloseButton: true,
        background: colors.darkPurple,
        color: colors.white,
        iconColor: colors.lightGreen,
        didOpen: () => {
            Swal.showLoading();
        },
        customClass: {
            loader: 'custom-loader'
        }
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