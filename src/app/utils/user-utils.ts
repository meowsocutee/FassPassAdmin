export class UserUtils {
  /**
   * Extracts initials from a name string.
   * Format: First character of first word + First character of last word.
   * @param name The full name of the user.
   * @returns Uppercase initials or empty string if name is invalid.
   */
  static getInitials(name: string | null | undefined): string {
    if (!name || typeof name !== 'string') return '';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 0 || (words.length === 1 && words[0] === '')) return '';

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);

    return (firstInitial + lastInitial).toUpperCase();
  }

  /**
   * Generates a consistent background color based on the user's name.
   * @param name The name to hash.
   * @returns A hex color string.
   */
  static getAvatarColor(name: string | null | undefined): string {
    if (!name) return '#94a3b8'; // slate-400 default

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      '#1e293b', // slate-800 (Dark brand color like in the image)
      '#ef4444', // red-500
      '#f97316', // orange-500
      '#f59e0b', // amber-500
      '#10b981', // emerald-500
      '#06b6d4', // cyan-500
      '#3b82f6', // blue-500
      '#6366f1', // indigo-500
      '#8b5cf6', // violet-500
      '#d946ef', // fuchsia-500
      '#ec4899'  // pink-500
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}
