import { useState, useCallback, useMemo } from 'react';
import { useComplaintsStore } from '../../application/usecases/complaint.store';
import {
  ComplaintCategoryLabels,
  ComplaintUrgencyLabels,
} from '../../domain/entities/complaint.types';
import type {
  CreateComplaintRequest,
  ComplaintCategory,
  ComplaintUrgency,
} from '../../domain/entities/complaint.types';
import type { SelectedFile } from '../views/components/evidence-upload';

/**
 * Hook personalizado para o formulário de criação de reclamação
 * Coordena a lógica de apresentação e validação do formulário
 */
export function useComplaintFormViewModel() {
  const store = useComplaintsStore();

  // Estado do formulário
  const [category, setCategoryState] = useState<ComplaintCategory | ''>('');
  const [description, setDescriptionState] = useState('');
  const [urgency, setUrgencyState] = useState<ComplaintUrgency | ''>('');
  const [isAnonymous, setIsAnonymousState] = useState(false);

  // Estado de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Opções para os selects (memorizadas para evitar re-criação)
  const categoryOptions = useMemo(() =>
    Object.entries(ComplaintCategoryLabels).map(([value, label]) => ({
      value: value as ComplaintCategory,
      label,
    })), []);

  const urgencyOptions = useMemo(() =>
    Object.entries(ComplaintUrgencyLabels).map(([value, label]) => ({
      value: value as ComplaintUrgency,
      label,
    })), []);

  // Seletores do store
  const isLoading = store.isLoading;
  const error = store.error;
  const lastCreatedComplaint = store.lastCreatedComplaint;

  // Actions
  const setCategory = useCallback((val: ComplaintCategory | '') => {
    setCategoryState(val);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.category;
      return newErrors;
    });
  }, []);

  const setDescription = useCallback((val: string) => {
    setDescriptionState(val);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.description;
      return newErrors;
    });
  }, []);

  const setUrgency = useCallback((val: ComplaintUrgency | '') => {
    setUrgencyState(val);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.urgency;
      return newErrors;
    });
  }, []);

  const setIsAnonymous = useCallback((val: boolean) => {
    setIsAnonymousState(val);
  }, []);

  /**
   * Valida os campos do formulário
   * @returns True se todos os campos são válidos
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category) {
      newErrors.category = 'Selecione uma categoria';
    }

    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    } else if (description.trim().length > 1000) {
      newErrors.description = 'Descrição deve ter no máximo 1000 caracteres';
    }

    if (!urgency) {
      newErrors.urgency = 'Selecione a urgência';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [category, description, urgency]);

  /**
   * Limpa o formulário para uma nova reclamação
   */
  const resetForm = useCallback(() => {
    setCategoryState('');
    setDescriptionState('');
    setUrgencyState('');
    setIsAnonymousState(false);
    setErrors({});
    store.setLastCreatedComplaint(null);
    store.clearError();
  }, [store]);

  /**
   * Submete o formulário
   * @param evidences - Arquivos de evidência selecionados (opcional)
   * @returns Promise que resolve quando a reclamação é criada
   */
  const submitForm = useCallback(async (evidences?: SelectedFile[]): Promise<void> => {
    if (!validateForm()) {
      throw new Error('Formulário contém erros de validação');
    }

    const requestData: CreateComplaintRequest = {
      category: category as ComplaintCategory,
      description: description.trim(),
      urgency: urgency as ComplaintUrgency,
      isAnonymous: isAnonymous,
    };

    // Cria a reclamação primeiro
    await store.createComplaint(requestData);

    // Se há evidências, faz upload (a criação foi bem-sucedida se chegou aqui)
    if (evidences && evidences.length > 0) {
      try {
        const complaint = store.lastCreatedComplaint;
        if (complaint?.id) {
          // TODO: Implementar upload de evidências após criação da reclamação
          console.log(`Fazer upload de ${evidences.length} evidências para reclamação ${complaint.id}`);
        }
      } catch (err) {
        // Log do erro mas não falha a criação da reclamação
        console.error('Erro ao fazer upload de evidências:', err);
      }
    }
  }, [validateForm, category, description, urgency, isAnonymous, store]);

  /**
   * Verifica se um campo tem erro
   * @param field - Nome do campo
   * @returns True se o campo tem erro
   */
  const hasFieldError = useCallback((field: string): boolean => {
    return !!errors[field];
  }, [errors]);

  /**
   * Obtém a mensagem de erro de um campo
   * @param field - Nome do campo
   * @returns Mensagem de erro ou undefined
   */
  const getFieldError = useCallback((field: string): string | undefined => {
    return errors[field];
  }, [errors]);

  return {
    category,
    description,
    urgency,
    isAnonymous,
    errors,
    categoryOptions,
    urgencyOptions,
    isLoading,
    error,
    lastCreatedComplaint,
    setCategory,
    setDescription,
    setUrgency,
    setIsAnonymous,
    submitForm,
    resetForm,
    hasFieldError,
    getFieldError
  };
}
