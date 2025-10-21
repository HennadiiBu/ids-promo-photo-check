import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelCardsGrouped({ openFullScreenMode }) {
  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState({});

  const CODE_COL = 'Код ТТ';
  const IMG_COL = 'Анкета: Посилання на контент МБД';
  //   const NEW_COL = 'Умови УПЦ виконані?';
  const NEW_COL_EXISTING = 'Перевірка ФОТО';

  // ---- Загрузка Excel ----
  //   const handleFileUpload = e => {
  //     const file = e.target.files?.[0];
  //     if (!file) return;
  //     const reader = new FileReader();
  //     reader.onload = ev => {
  //       const arrayBuffer = ev.target.result;
  //       const wb = XLSX.read(arrayBuffer, { type: 'array' });
  //       const sheetName = wb.SheetNames[0];
  //       const ws = wb.Sheets[sheetName];
  //       const parsed = XLSX.utils.sheet_to_json(ws, { defval: '' });
  //       setData(parsed);
  //       setAnswers({});
  //     };
  //     reader.readAsArrayBuffer(file);
  //   };
  const handleFileUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const arrayBuffer = ev.target.result;
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const parsed = XLSX.utils.sheet_to_json(ws, { defval: '' });

      const initialAnswers = {};
      parsed.forEach(row => {
        const code = row[CODE_COL] || JSON.stringify(row);
        if (
          row[NEW_COL_EXISTING] !== undefined &&
          row[NEW_COL_EXISTING] !== ''
        ) {
          initialAnswers[code] = row[NEW_COL_EXISTING]; // берём уже заполненное значение
        }
      });

      setData(parsed);
      setAnswers(initialAnswers);
    };
    reader.readAsArrayBuffer(file);
  };

  // ---- Установка ответа для кода ----
  const setAnswerFor = (code, value) => {
    setAnswers(prev => ({ ...prev, [code]: value }));
  };

  //   ---- Экспорт Excel с новым столбцом ----
  const exportUpdatedExcelAll = () => {
    if (!data.length) return alert('Нет данных для экспорта.');
    const updated = data.map(row => {
      const code = row[CODE_COL] || JSON.stringify(row);
      return {
        ...row,
        [NEW_COL_EXISTING]: answers[code] !== undefined ? answers[code] : '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(updated);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Updated');
    XLSX.writeFile(wb, 'updated_with_answers.xlsx');
  };

  // ---- Экспорт Excel с новым столбцом, только с данными 5 или 2 ----
  const exportUpdatedExcel = () => {
    if (!data.length) return alert('Нет данных для экспорта.');

    const updated = data
      .map(row => {
        const code = row[CODE_COL] || JSON.stringify(row);
        return {
          ...row,
          [NEW_COL_EXISTING]: answers[code] !== undefined ? answers[code] : '',
        };
      })
      .filter(
        row => row[NEW_COL_EXISTING] === 5 || row[NEW_COL_EXISTING] === 2
      ); // фильтруем строки

    if (!updated.length)
      return alert('Нет строк с данными 5 или 2 для экспорта.');

    const ws = XLSX.utils.json_to_sheet(updated);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Updated');
    XLSX.writeFile(wb, 'updated_with_answers.xlsx');
  };

  // ---- Группировка по Код ТТ ----
  const groupedData = Object.values(
    data.reduce((acc, row) => {
      const code = row[CODE_COL] || 'no_code';
      if (!acc[code]) acc[code] = { code, rows: [] };
      acc[code].rows.push(row);
      return acc;
    }, {})
  );

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h3>Загрузить Excel и отобразить карточки</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      {!data.length ? (
        <p style={{ marginTop: 12 }}>
          Загрузите файл Excel — появятся карточки.
        </p>
      ) : (
        <>
          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <button onClick={exportUpdatedExcel}>
              📊 Экспортировать Excel только проверенные
            </button>
          </div>
          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <button onClick={exportUpdatedExcelAll}>
              📊 Экспортировать Excel всё
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 12,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {groupedData.map((group, idx) => {
              const code = group.code;
              const chosen = answers[code] !== undefined ? answers[code] : '';

              return (
                <div
                  key={code + '_' + idx}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    padding: 12,
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    position: 'relative',
                    minHeight: 260,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '300px',
                    gap: 8,
                  }}
                >
                  {/* Код ТТ */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      fontWeight: 700,
                    }}
                  >
                    Код ТТ: {code}
                  </div>

                  {/* Картинки */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginTop: 30,
                      justifyContent: 'center',
                    }}
                  >
                    {group.rows.map((row, i) =>
                      row[IMG_COL] ? (
                        <img
                          onClick={() =>
                            openFullScreenMode(row[IMG_COL], `img_${i}`)
                          }
                          key={i}
                          src={row[IMG_COL]}
                          alt={`img_${i}`}
                          style={{
                            maxWidth: 140,
                            maxHeight: 140,
                            objectFit: 'contain',
                            borderRadius: 6,
                          }}
                          onError={e =>
                            (e.currentTarget.style.display = 'none')
                          }
                        />
                      ) : null
                    )}
                  </div>

                  <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                    {/* Вопрос */}
                    <div
                      style={{
                        marginTop: 8,
                        fontWeight: 600,
                        backgroundColor: '#FFF',
                        padding: '6px',
                        borderRadius: '6px',
                      }}
                    >
                      Умови УПЦ виконані?
                      {answers[code] &&
                        !['5', '2'].includes(String(answers[code])) && (
                          <span style={{ color: 'orange', marginLeft: 6 }}>
                            (уже заполнено: {answers[code]})
                          </span>
                        )}
                    </div>

                    {/* Варианты ответа */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: '#FFF',
                        padding: '6px',
                        borderRadius: '6px',
                      }}
                    >
                      {[5, 2, ''].map(v => {
                        const lab = v === '' ? '—' : String(v);
                        const active = String(chosen) === String(v);
                        return (
                          <button
                            key={lab}
                            onClick={() => setAnswerFor(code, v)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 6,
                              border: '1px solid #ccc',
                              background: active ? '#1976d2' : '#f5f5f5',
                              color: active ? '#fff' : '#222',
                              cursor: 'pointer',
                            }}
                          >
                            {lab}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
