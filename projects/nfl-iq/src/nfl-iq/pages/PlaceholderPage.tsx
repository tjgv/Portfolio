type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="iq-placeholder">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
