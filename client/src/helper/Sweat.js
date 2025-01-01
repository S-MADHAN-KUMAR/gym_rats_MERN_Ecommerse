import Swal from 'sweetalert2';

export const showBlockConfirmation = async (title, newStatus, onSuccess, onError) => {
  try {
    const result = await Swal.fire({
      title: title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes `
    });

    if (result.isConfirmed) {
      onSuccess(newStatus); 
    } else {
      onError();  
    }
  } catch (error) {
    console.error("Error displaying SweetAlert:", error);
    onError(); 
  }
};
