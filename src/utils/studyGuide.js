export function getStudyGuideByCategory(studyGuide) {
  const grouped = {};
  if (!Array.isArray(studyGuide)) return grouped;

  studyGuide.forEach(function (section) {
    const category = section.category || "General";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(section);
  });

  return grouped;
}

export function getStudyGuideSection(studyGuide, id) {
  if (!id || !Array.isArray(studyGuide)) return null;
  return studyGuide.find(function (section) { return section.id === id; }) || null;
}
