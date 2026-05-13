import React, { useMemo, useState } from "react";

const initialRows = [
  {
    id: 1,
    date: "2026-05-13",
    platform: "TikTok",
    title: "하나님은 왜 기도하라고 하시는가?",
    views: 3920,
    likes: 241,
    comments: 37,
    shares: 66
  },
  {
    id: 2,
    date: "2026-05-13",
    platform: "X / Twitter",
    title: "하나님은 왜 기도하라고 하시는가?",
    views: 760,
    likes: 31,
    comments: 6,
    shares: 9
  }
];

function numberFormat(value) {
  return new Intl.NumberFormat("ko-KR").format(Number(value || 0));
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}

function StatCard({ label, value }) {
  return (
    <Card>
      <div className="statLabel">{label}</div>
      <div className="statValue">{numberFormat(value)}</div>
    </Card>
  );
}

export default function App() {
  const [rows, setRows] = useState(initialRows);
  const [selectedImage, setSelectedImage] = useState(null);
  const [platform, setPlatform] = useState("TikTok");
  const [title, setTitle] = useState("");
  const [form, setForm] = useState({ views: "", likes: "", comments: "", shares: "" });

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.views += Number(row.views || 0);
        acc.likes += Number(row.likes || 0);
        acc.comments += Number(row.comments || 0);
        acc.shares += Number(row.shares || 0);
        return acc;
      },
      { views: 0, likes: 0, comments: 0, shares: 0 }
    );
  }, [rows]);

  function handleImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setSelectedImage({
      name: file.name,
      url: URL.createObjectURL(file)
    });
  }

  function addRow() {
    if (!title.trim()) {
      alert("영상 제목을 입력하세요.");
      return;
    }

    setRows([
      {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        platform,
        title,
        views: Number(form.views || 0),
        likes: Number(form.likes || 0),
        comments: Number(form.comments || 0),
        shares: Number(form.shares || 0)
      },
      ...rows
    ]);

    setTitle("");
    setForm({ views: "", likes: "", comments: "", shares: "" });
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="badge">Bible Again Media Center</div>
        <h1>TikTok / X 성과 대시보드</h1>
        <p>
          TikTok과 X/Twitter 분석 화면을 캡처해서 업로드하고, 조회수·좋아요·댓글·공유 수를
          한곳에서 정리하는 사역용 미디어 분석판입니다.
        </p>
      </header>

      <section className="grid four">
        <StatCard label="총 조회수" value={totals.views} />
        <StatCard label="총 좋아요" value={totals.likes} />
        <StatCard label="총 댓글" value={totals.comments} />
        <StatCard label="총 공유" value={totals.shares} />
      </section>

      <section className="grid two">
        <Card>
          <h2>1. 스크린샷 업로드</h2>
          <p className="muted">
            TikTok 또는 X 분석 화면을 캡처한 뒤 여기에 업로드하세요.
            현재는 미리보기와 수동 입력을 지원하고, 다음 단계에서 AI 숫자 인식을 붙입니다.
          </p>

          <label className="uploadBox">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <span>스크린샷 선택</span>
          </label>

          {selectedImage && (
            <div className="preview">
              <div className="fileName">{selectedImage.name}</div>
              <img src={selectedImage.url} alt="업로드한 분석 스크린샷" />
            </div>
          )}
        </Card>

        <Card>
          <h2>2. 숫자 입력 / OCR 결과 확인</h2>
          <p className="muted">
            지금은 숫자를 직접 입력합니다. 다음 단계에서 AI가 스크린샷에서 숫자를 읽어 이 칸에
            자동으로 채우게 됩니다.
          </p>

          <div className="form">
            <label>
              플랫폼
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>TikTok</option>
                <option>X / Twitter</option>
              </select>
            </label>

            <label>
              영상 제목
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 하나님은 왜 기도하라고 하시는가?"
              />
            </label>

            <div className="miniGrid">
              <label>
                조회수
                <input type="number" value={form.views} onChange={(e) => setForm({ ...form, views: e.target.value })} />
              </label>
              <label>
                좋아요
                <input type="number" value={form.likes} onChange={(e) => setForm({ ...form, likes: e.target.value })} />
              </label>
              <label>
                댓글
                <input type="number" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
              </label>
              <label>
                공유
                <input type="number" value={form.shares} onChange={(e) => setForm({ ...form, shares: e.target.value })} />
              </label>
            </div>

            <button onClick={addRow}>대시보드에 추가</button>
          </div>
        </Card>
      </section>

      <Card>
        <h2>3. 기록된 영상 성과</h2>
        <div className="table">
          <div className="tableHead">
            <div>날짜</div>
            <div>플랫폼</div>
            <div>제목</div>
            <div>조회수</div>
            <div>좋아요</div>
            <div>댓글</div>
            <div>공유</div>
          </div>

          {rows.map((row) => (
            <div className="tableRow" key={row.id}>
              <div>{row.date}</div>
              <div>{row.platform}</div>
              <div className="titleCell">{row.title}</div>
              <div>{numberFormat(row.views)}</div>
              <div>{numberFormat(row.likes)}</div>
              <div>{numberFormat(row.comments)}</div>
              <div>{numberFormat(row.shares)}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2>다음 단계</h2>
        <p className="muted">
          다음 업데이트에서 OpenAI Vision 또는 OCR 엔진을 연결하면, 업로드한 스크린샷에서 숫자를
          자동으로 읽어 조회수·좋아요·댓글·공유 칸에 채우게 됩니다.
        </p>
      </Card>
    </div>
  );
}
