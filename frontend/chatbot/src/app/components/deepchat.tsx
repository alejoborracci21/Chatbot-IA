import {DeepChat} from 'deep-chat-react';


export default function Deepchat() {
  return (
    <div className="flex items-center justify-center bg-black">
      <DeepChat demo={true} style={{
        background: '#0a0a0a',
        borderRadius: '10px',
      }}
      textInput={{
        placeholder: {
          text: 'Escribe un mensaje...',
          
        }
      }} />
    </div>
  );
}