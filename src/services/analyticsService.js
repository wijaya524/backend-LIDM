import AnalyticsModel from '../models/analyticsModel.js';

class AnalyticsService {
  /**
   * Analyze a game session based on Task Initiation Time (response_time) and generate
   * recommendations tailored for children with intellectual disabilities (anak tunagrahita)
   * @param {object} log - LogGame database record
   * @returns {Promise<object>} Created analytical result
   */
  static async analyzeSession(log) {
    const { log_id, response_time, wrong_answer_count, hint_count } = log;

    let pattern_found = '';
    let recommendation = '';

    // 1. Analyze performance pattern based on Task Initiation Time (stored in response_time)
    if (response_time > 25) {
      pattern_found = 'Butuh Dorongan Inisiasi Ekstra';
      recommendation = 'Anak membutuhkan waktu lebih lama untuk mulai merespon atau menekan tombol bermain setelah tugas disajikan. Disarankan memberikan dorongan verbal yang lembut ("Ayo kita coba!"), mengulangi instruksi audio, atau memberikan contoh nyata agar anak terpicu untuk memulai.';
    } else if (wrong_answer_count > 2) {
      pattern_found = 'Membutuhkan Bimbingan Tambahan';
      recommendation = 'Anak sudah berani memulai dengan baik, namun masih sering melakukan kesalahan. Kami merekomendasikan untuk mendampingi anak meninjau kembali konsep melalui Panduan Guru atau menonton Video Cerita belajar bersama.';
    } else if (response_time <= 25 && response_time > 12) {
      pattern_found = 'Inisiasi Tugas Cukup Baik';
      recommendation = 'Bagus! Anak menunjukkan minat dan mampu memulai tugas dengan tempo yang wajar. Teruskan bimbingan santai untuk membangun kemandirian anak.';
    } else {
      pattern_found = 'Inisiasi Tugas Sangat Cepat';
      recommendation = 'Luar biasa! Anak sangat cepat dan tanggap dalam memulai tugas begitu tombol atau pertanyaan disajikan. Ini menunjukkan tingkat fokus dan antusiasme yang tinggi!';
    }

    // 2. Adjust recommendations based on hint usage
    if (hint_count > 3) {
      pattern_found += ' & Ketergantungan Bantuan Suara';
      recommendation += ' Tips tambahan: Gunakan tombol bantuan suara secara konsisten untuk melatih ketertarikan mendengar instruksi bagi anak yang sering ragu memulai.';
    } else if (hint_count > 0 && wrong_answer_count === 0) {
      recommendation += ' Bantuan suara terbukti membantu mempercepat inisiasi dan akurasi anak dalam menjawab.';
    }

    // 3. Adjust based on specific time thresholds
    if (response_time > 15 && wrong_answer_count > 1) {
      recommendation += ' Berikan apresiasi verbal (positive reinforcement) di awal setiap tugas baru untuk meningkatkan motivasi inisiasi anak.';
    } else if (response_time < 8 && wrong_answer_count === 0) {
      recommendation += ' Kecepatan inisiasi kognitif anak sangat mengagumkan tanpa ada kesalahan!';
    }

    // Save to analytical_results table
    const analysis = await AnalyticsModel.create(log_id, pattern_found, recommendation);
    return analysis;
  }
}

export default AnalyticsService;
