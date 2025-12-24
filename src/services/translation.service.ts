import { Injectable, signal, computed } from '@angular/core';

export type LangCode = 'en' | 'es' | 'fr';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<LangCode>('en');

  private dictionary: Record<LangCode, Record<string, string>> = {
    'en': {
      'dashboard': 'Dashboard',
      'planner': 'Planner',
      'notes': 'Notes',
      'community': 'Community',
      'profile': 'Profile',
      'settings': 'Settings',
      'logout': 'Log out',
      'credits': 'credits',
      'good_morning': 'Good morning',
      'good_afternoon': 'Good afternoon',
      'good_evening': 'Good evening',
      'ai_coach': 'AI Study Coach',
      'upgrade_pro': 'Unlock personalized coaching',
      'free_preview': 'Free Preview',
      'recent_docs': 'Recent Documents',
      'start_session': 'Start New Session',
      'upload_notes': 'Upload your notes to generate...',
      'study_smarter': 'Study Smarter, Not Harder',
      'todays_plan': "Today's Plan",
      'no_sessions': 'No sessions scheduled',
      'create_plan': 'Create a study plan',
      'community_picks': 'Community Top Picks',
      'explore': 'Explore',
      'view_analytics': 'View Analytics',
      'my_groups': 'Your Groups',
      'all_posts': 'All Posts',
      'join': 'Join',
      'joined': 'Joined',
      'search': 'Search...',
      'save': 'Save',
      'saved': 'Saved',
      'comments': 'Comments',
      'add_comment': 'Add a comment...',
      'post': 'Post',
      'translate': 'Translate Content',
      'translating': 'Translating...',
      'original': 'Show Original',
      'premium_badge': 'PRO MEMBER',
      'views': 'views',
      'report': 'Report Content',
      'no_comments': 'No comments yet. Be the first!'
    },
    'es': {
      'dashboard': 'Tablero',
      'planner': 'Agenda',
      'notes': 'Notas',
      'community': 'Comunidad',
      'profile': 'Perfil',
      'settings': 'Configuración',
      'logout': 'Cerrar sesión',
      'credits': 'créditos',
      'good_morning': 'Buenos días',
      'good_afternoon': 'Buenas tardes',
      'good_evening': 'Buenas noches',
      'ai_coach': 'Entrenador IA',
      'upgrade_pro': 'Desbloquear coaching personal',
      'free_preview': 'Vista previa gratuita',
      'recent_docs': 'Documentos recientes',
      'start_session': 'Nueva sesión',
      'upload_notes': 'Sube tus notas para generar...',
      'study_smarter': 'Estudia mejor, no más duro',
      'todays_plan': "Plan de hoy",
      'no_sessions': 'Sin sesiones programadas',
      'create_plan': 'Crear plan de estudio',
      'community_picks': 'Destacados de la comunidad',
      'explore': 'Explorar',
      'view_analytics': 'Ver análisis',
      'my_groups': 'Tus grupos',
      'all_posts': 'Publicaciones',
      'join': 'Unirse',
      'joined': 'Unido',
      'search': 'Buscar...',
      'save': 'Guardar',
      'saved': 'Guardado',
      'comments': 'Comentarios',
      'add_comment': 'Añadir comentario...',
      'post': 'Publicar',
      'translate': 'Traducir contenido',
      'translating': 'Traduciendo...',
      'original': 'Ver original',
      'premium_badge': 'MIEMBRO PRO',
      'views': 'vistas',
      'report': 'Reportar contenido',
      'no_comments': 'Sin comentarios. ¡Sé el primero!'
    },
    'fr': {
      'dashboard': 'Tableau de bord',
      'planner': 'Planning',
      'notes': 'Notes',
      'community': 'Communauté',
      'profile': 'Profil',
      'settings': 'Paramètres',
      'logout': 'Déconnexion',
      'credits': 'crédits',
      'good_morning': 'Bonjour',
      'good_afternoon': 'Bon après-midi',
      'good_evening': 'Bonsoir',
      'ai_coach': 'Coach IA',
      'upgrade_pro': 'Débloquer le coaching',
      'free_preview': 'Aperçu gratuit',
      'recent_docs': 'Documents récents',
      'start_session': 'Nouvelle session',
      'upload_notes': 'Téléchargez vos notes pour...',
      'study_smarter': 'Étudiez plus intelligemment',
      'todays_plan': "Plan du jour",
      'no_sessions': 'Aucune session prévue',
      'create_plan': 'Créer un plan',
      'community_picks': 'Choix de la communauté',
      'explore': 'Explorer',
      'view_analytics': 'Voir les analyses',
      'my_groups': 'Vos groupes',
      'all_posts': 'Tous les messages',
      'join': 'Rejoindre',
      'joined': 'Rejoint',
      'search': 'Rechercher...',
      'save': 'Enregistrer',
      'saved': 'Enregistré',
      'comments': 'Commentaires',
      'add_comment': 'Ajouter un commentaire...',
      'post': 'Publier',
      'translate': 'Traduire le contenu',
      'translating': 'Traduction...',
      'original': 'Voir l\'original',
      'premium_badge': 'MEMBRE PRO',
      'views': 'vues',
      'report': 'Signaler',
      'no_comments': 'Aucun commentaire. Soyez le premier !'
    }
  };

  translate(key: string): string {
    const lang = this.currentLang();
    return this.dictionary[lang]?.[key] || this.dictionary['en'][key] || key;
  }

  setLanguage(lang: LangCode) {
    this.currentLang.set(lang);
    localStorage.setItem('studymate_lang', lang);
  }

  constructor() {
    const saved = localStorage.getItem('studymate_lang') as any;
    if (saved && ['en', 'es', 'fr'].includes(saved)) {
      this.currentLang.set(saved);
    }
  }
}