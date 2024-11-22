import SectionCard from "./SectionCard"

function SectionsList ({ sections, fallback }) {
  const hasSections = sections.length
  return (
    <div className="sections-container">
      {hasSections ? (
        <>
          <div className="section-title">Sections</div>
          <div className="list">
            {sections.map(section => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </>
      ) : <p>{fallback}</p>
      }
    </div>
  )
}

export default SectionsList
