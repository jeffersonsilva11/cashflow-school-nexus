
  // Função para finalizar o cadastro
  const handleFinish = () => {
    // Generate a random ID for the school if not present
    if (!formData.id) {
      const newId = `schl_${Math.random().toString(36).substring(2, 15)}`;
      updateFormData({ id: newId });
    }
    
    // Aqui seria implementada a lógica para salvar os dados no backend
    console.log('Dados da escola para envio:', formData);
    setCurrentStep('confirmation');
  };
