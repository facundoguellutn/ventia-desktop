// src/components/FloatingModal.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

const FloatingModal = () => {
  console.log('FloatingModal')
  return (
    <div className="p-6 bg-white shadow-2xl rounded-xl w-full h-full flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-4">Modal flotante</h2>
      <p className="mb-4">Aquí puedes mostrar la información que quieras.</p>
      <Button onClick={() => window.close()}>Cerrar</Button>
    </div>
  );
};

export default FloatingModal;
