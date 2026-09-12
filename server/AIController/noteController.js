import {getAuth} from '@clerk/express';
import sql from '../configs/db.js'


//LISTA NOTAS
export const getNotes = async(req, res) => {
  try{
    const {userId} = getAuth(req);

    if(!userId) {
      return res.status(401).json({ success: false, message: 'Não autorizado'})
    }

    const notes = await sql`
      SELECT id, title, content, color, created_at
      FROM notes
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return res.json({ success: true, notes})

  }catch(error) {
    console.log('Error ao buscar notas:', error)
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar notas'})
  }
}

//CRIAR NOTAS
export const createNote = async(req, res) => {
  try{
    const {userId} = getAuth(req);

     if(!userId) {
      return res.status(401).json({ success: false, message: 'Não autorizado'})
    }

    const {title, content, color} = req.body;

    if(!title || !content) {
      return res.status(400).json({ seccess: false, message: 'Titulo e conteudo são obrigatorios'})
    }

    const newNote = await sql`
      INSERT INTO notes (user_id, title, content, color)
      VALUES (${userId}, ${title}, ${content}, ${color || 'bg-yellow-100'})
      RETURNING id, title, content, color, created_at
    `

     return res.json({ success: true, note: newNote[0] })

  }catch(error) {
    console.log('Erro ao criar notas', error)
    return res.status(500).json({ success: false, message: 'Erro ao criar notas'})
  }
}

//EDITAR NOTAS
export const updateNote = async(req, res) => {
  try{
    const {userId} = getAuth(req);

    if(!userId) {
      return res.status(400).json({ success: false, message: 'Não auteticado'})
    }

     const { id } = req.params;
     const { title, content } = req.body;

     const updated = await sql`
      UPDATE notes
      SET title = ${title}, content = ${content}
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id, title, content, color, created_at
     `

     if(updated.length === 0){
       return res.status(404).json({ success: false, message: 'Nota não encontrada'})
     }

     return res.json({ success: true, note: updated[0]})

  }catch(error) {
    console.log('Erro ao editar notas', error)
    return res.status(500).json({ success: false, message: 'Erro ao editar notas'})
  }
}

//EXCLUIR NOTA
export const deleteNote = async(req, res) => {
  try{
    const {userId} = getAuth(req);

    if(!userId) {
      return res.status(400).json({ success: false, message: 'Não auteticado'})
    }

     const {id} = req.params;

     await sql`
      DELETE FROM notes
      WHERE id = ${id} AND user_id = ${userId}
     `
     return res.json({ success: true, message: 'Nota excluida com sucesso'})

  }catch(error) {
      console.log('Erro ao deletar notas', error)
      return res.status(500).json({ success: false, message: 'Error ao deletar notas'})  
  }
}