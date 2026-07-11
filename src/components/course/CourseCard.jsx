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

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="course-card-image">
        <img
          src={course.thumbnail_url || "https://placehold.co/800x450?text=DevSyntax"}
          alt={course.title}
        />
      </div>

      <div className="course-card-body">
        <h3>{course.title}</h3>

        <p className="course-description">
          {course.description}
        </p>

        <span className="price">{formatPrice(course.price)}</span>
      </div>
    </Link>
  );
}

