import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogMui from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { remove } from '@/api/todo.api';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useAuthContext } from '@/context/authContext';
type Props = {
    id:string,
    onOpen : (x:boolean) => void;
    open:boolean
}

export default function Dialog({id,onOpen,open}:Props){
    const {user} =useAuthContext()
    const handleDelete = async ()=>{
        const res = await remove(id,user!.id)
        if(res){
            toast.success('🦄 Xóa task thành công!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }else{
        toast.error('lỗi!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });

        }
        onOpen(false)
    }
    return (
        <>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        />
        <DialogMui open={open} onClose={() => onOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa dòng này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </DialogMui>
        </>
    )
}