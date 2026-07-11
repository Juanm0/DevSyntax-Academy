import { Link } from "react-router-dom";
import "./CourseCard.css";

function formatPrice(price) {
  if (price === null || price === undefined) return "Consultar precio";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function LevelIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h4V10H3v8Zm7 0h4V6h-4v12Zm7 0h4v-5h-4v5Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}

export default function CourseCard({ course }) {
  const stackPreview = course.stack?.slice(0, 3) || [];
  const stackExtra = (course.stack?.length || 0) - stackPreview.length;

  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="course-card-image">
        <img
          src={course.thumbnail_url || course.cover_image || "https://placehold.co/800x450?text=DevSyntax"}
          alt={course.title}
        />

        {/* Se activa solo si el curso tiene preview_video_url cargado en Supabase */}
        {course.preview_video_url && (
          <span className="play-overlay" aria-hidden="true">
            <PlayIcon />
          </span>
        )}

        <div className="image-badges">
          {course.level && (
            <span className="badge">
              <LevelIcon /> {course.level}
            </span>
          )}
          {course.duration && (
            <span className="badge">
              <ClockIcon /> {course.duration}
            </span>
          )}
        </div>
      </div>

      <div className="course-card-body">
        <h3>{course.title}</h3>

        <p className="course-description">
          {course.description}
        </p>

        {stackPreview.length > 0 && (
          <div className="stack-chips">
            {stackPreview.map((tech) => (
              <span className="chip" key={tech}>{tech}</span>
            ))}
            {stackExtra > 0 && <span className="chip chip-muted">+{stackExtra}</span>}
          </div>
        )}

        <div className="card-footer">
          <span className="price">{formatPrice(course.price)}</span>
          <span className="view-course">Ver curso →</span>
        </div>
      </div>
    </Link>
  );
}

