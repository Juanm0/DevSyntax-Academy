import { useParams } from "react-router-dom";

export default function Course() {
  const { id } = useParams();
  return <h1>Curso {id}</h1>;
}
