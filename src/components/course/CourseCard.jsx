import { Link } from "react-router-dom";
import "./CourseCard.css";

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="course-card-image">
        <img
          src={course.thumbnail_url || "https://via.placeholder.com/800x450"}
          alt={course.title}
        />
      </div>

      <div className="course-card-body">
        <h3>{course.title}</h3>

        <p className="course-description">
          {course.description}
        </p>

        <span className="price">$35.000</span>
      </div>
    </Link>
  );
}

