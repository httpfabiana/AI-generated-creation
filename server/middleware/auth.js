import { clerkClient, getAuth } from '@clerk/express';

export const auth = async (req, res, next) => {
  try {
    // 1. CORREÇÃO: req.auth é um OBJETO síncrono injetado pelo clerkMiddleware()
    // Se preferir, também pode usar: const { userId, has } = getAuth(req);
    const { userId, has } = getAuth(req)

    // Proteção básica: impede prosseguir se não houver um usuário autenticado
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Não autorizado' });
    }

    // 2. CORREÇÃO: O método .has() é síncrono
    const hasPremiumPlan = has({ plan: 'premium' });

    // Busca os dados do usuário no backend da Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      // Zera o free_usage caso seja premium ou caso não tenha um valor definido
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0
        }
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? 'premium' : 'free';

    next();

  } catch (error) {
    console.error('ERRO NO AUTH:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
