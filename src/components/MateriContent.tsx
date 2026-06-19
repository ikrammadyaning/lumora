interface MateriContentProps {
  title: string
}

export default function MateriContent({ title }: MateriContentProps) {
  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100" style={{ backgroundColor: 'var(--card-bg)' }}>
      <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-3">
        <p>
          Segala puji bagi Allah ﷻ, Tuhan semesta alam. Salawat dan salam semoga tercurah
          kepada Nabi Muhammad ﷺ, kepada keluarganya, para sahabatnya, dan seluruh
          pengikutnya hingga akhir zaman.
        </p>
        <p>
          Pada materi ini, kita akan mempelajari dasar-dasar ilmu yang sangat penting
          bagi setiap muslim. Ilmu ini menjadi fondasi dalam memahami ajaran Islam
          secara benar dan menyeluruh.
        </p>
        <p>
          Allah ﷻ berfirman dalam Al-Qur&apos;an: "{'"'}Maka ketahuilah, bahwa
          sesungguhnya tidak ada Tuhan selain Allah{'"'} (QS. Muhammad: 19). Ayat ini
          menunjukkan betapa pentingnya ilmu bagi setiap mukmin.
        </p>
        <p>
          Rasulullah ﷺ bersabda: "{'"'}Barang siapa yang Allah kehendaki kebaikan
          padanya, niscaya Dia akan memahamkan ia dalam urusan agama.{'"'}" (HR.
          Bukhari dan Muslim).
        </p>
        <p>
          Mari kita simak dengan seksama dan catat poin-poin penting dari materi
          ini. Semoga Allah memberkahi ilmu yang kita pelajari.
        </p>
      </div>
    </div>
  )
}
