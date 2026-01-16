import { useNavigate } from 'react-router-dom';
import { ComplaintForm } from './complaint-form/ComplaintForm';

/**
 * Página que encapsula o formulário de criação de reclamação
 */
export const CreateComplaintPage = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        // Redireciona para o feed de reclamações após o sucesso
        // O formulário já mostra uma mensagem de sucesso por 3 segundos antes de chamar onSuccess
        navigate('/complaints');
    };

    const handleCancel = () => {
        navigate(-1); // Volta para a página anterior
    };

    return (
        <div style={{
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
                <ComplaintForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};

export default CreateComplaintPage;
