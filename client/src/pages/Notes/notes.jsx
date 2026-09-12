import { useState, useEffect } from "react";
import {useAuth} from '@clerk/react'
import {Plus, Trash2, Edit3, Loader2, StickyNote, X} from 'lucide-react';

const Notes = () => {
  const {getToken} = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const fetchNotes = async() => {
    try{
      setLoading(true)
      const token = await getToken();

      const response = await fetch('http://localhost:3000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json();

      if(data.success) setNotes(data.notes)

    }catch(error){
      console.log('Error ao buscar notas:', error)
    }finally {
      setLoading(false)
    }
  }

   useEffect(() => {
   fetchNotes()
 },[])

  const handleCreateNote = async(e) => {
    e.preventDefault();

    try{
     const token = await getToken();

     const response = await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
       body: JSON.stringify({ title, content})
     })
     const data = await response.json();

     if(data.success) {
      setNotes([data.note, ...notes]);
      setTitle('');
      setContent('');

     }else {
      alert(data.message)
     }

    }catch(error) {
      console.log('Erro ao criar nota:', error)
    }
  }

   const handleDeleteNote = async(id) => {
    if(!confirm('Deseja realmente excluir esta nota?')) return;

    try{
     const token = await getToken();
     const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
       method: 'DELETE',
       headers: {
         Authorization: `Bearer ${token}`
       }
     })

      const data = await res.json();

      if(data.success) {
       setNotes(notes.filter((n) => n.id !== id))
      }

    }catch(error) {
      console.log('Erro ao deletar nota:', error)
    }
   }

    const handleUpdateNote = async(e) => {
      e.preventDefault()

      try{
       const token = await getToken();

       const response = await fetch(`http://localhost:3000/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`  
        },
        body: JSON.stringify({ title: editTitle, content: editContent})
       })

        const data = await response.json();

        if(data.success){
          setNotes(notes.map((n) => (n.id === editingNote.id ? data.note : n)))
          setEditingNote(null)
        }

      }catch(error) {
        console.log('Erro ao atualizar nota:', error)
      }
    }

    return (
     <div className="h-full overflow-y-auto p-6 text-slate-700">
      <form onSubmit={handleCreateNote} className="mb-8 p-4 bg-white rounded-xl border border-gray-200 max-w-2xl shadow-xs">
       <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold">
        <StickyNote className="w-5 h-5 text-amber-500"/>
         <h2>Criar nova anotação</h2>
       </div>

       <input
        type="text"
        placeholder="Titulo da nota..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400"
       />

       <textarea
         placeholder="Escreva sua nota aqui.."
         rows={3}
         value={content}
         onChange={(e) => setContent(e.target.value)}
         className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 resize-none"
       />

       <button type='submit' className="mt-3 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
         <Plus className="w-4 h-4"/> Adicionar Post-it
       </button>
      </form>

       <h2 className="text-lg font-semibold mb-4 text-slate-800">
         Minhas Anotações
       </h2>

        {loading ? (
         <div className="flex items-center gap-2 text-gray-500 p-6 justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500"/>
          <p className="text-sm">Carregando anotações</p>
         </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notes.map((note) => (
             <div key={note.id} className="p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-xs flex flex-col justify-between h-52 hover:shadow-md transition-shadow relative group">
              <div>
               <h3 className="font-bold text-amber-950 text-base border-b border-amber-200/60 pb-2 mb-2 break-words">
                {note.titles}
               </h3>
               <p className="text-xs text-amber-900/80 whitespace-pre-line line-clamp-5 break-words">
                 {note.content}
               </p>
              </div>
               
              <div className="flex justify-between items-center pt-2 border-t border-amber-200/60 mt-2 text-xs text-amber-800/60">
               <span>
                 {new Date(note.created_at).toLocaleDateString('pt-BR')}
               </span>
               <div className="flex gap-1">
                <button onClick={() => {setEditingNote(note), setEditTitle(note.title), setEditContent(note.content)}}
                  className="p-1.5 hover:bg-amber-200/60 rounded-md text-amber-800 transition-colors"
                  title="Editar"
                >
                 <Edit3 className="w-4 h-4"/>
                </button>

                <button onClick={() => handleDeleteNote(note.id)} className="p-1.5 hover:bg-red-100 rounded-md text-red-600 transition-colors" title="Excluir">
                  <Trash2 className="w-4 h-4"/>
                </button>
               </div>
              </div>
             </div>
            ))}
          </div>  
        ) : (
          <p className="text-sm text-gray-400">Nenhuma anotação criada ainda.</p>
        )}

        {editingNote && (
         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">

           <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-semibold text-lg">Editar Anotações</h3>
            <button onClick={() => setEditingNote(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5"/>
            </button>
           </div>

           <form onSubmit={handleUpdateNote} className="space-y-3">
            <input
             type="text"
             value={editTitle}
             onChange={(e) => setEditTitle(e.target.value)}
             className='w-full p-2 text-sm border rounded-lg outline-none focus:border-amber-400'
             required
            />

            <textarea
             rows={5}
             value={editContent}
             onChange={(e) => setEditContent(e.target.value)}
             className="w-full p-2 text-sm border rounded-lg outline-none focus:border-amber-400 resize-none"
             required
            />

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingNote(null)} className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50">
               Cancelar
             </button>   

             <button type="submit" className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium">
               Salvar Alterações
             </button>
            </div>
           </form>
          </div>
         </div>  
        )}
     </div>
   )
}

export default Notes;