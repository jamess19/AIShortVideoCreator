export function parseTime(str: string): number {
    const parts = str.split(':').map(Number);
    if (parts.length === 2) {
      const [min, sec] = parts;
      if (sec >= 60) return NaN; // Không cho vượt quá 59 giây
      return min * 60 + sec;
    }
    return NaN;
  }
  
export function formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  