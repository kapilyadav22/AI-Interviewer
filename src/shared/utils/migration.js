export const migrateStorage = () => {
  const migrations = {
    // Legacy MockMate
    mockmate_vault: "nextoffer_ai_vault",
    mockmate_flashcard_mastery: "nextoffer_ai_flashcard_mastery",
    mockmate_theme: "nextoffer_ai_theme",
    // Intermediate NextOffer
    nextoffer_vault: "nextoffer_ai_vault",
    nextoffer_flashcard_mastery: "nextoffer_ai_flashcard_mastery",
    nextoffer_theme: "nextoffer_ai_theme",
  };

  Object.entries(migrations).forEach(([oldKey, newKey]) => {
    const oldData = localStorage.getItem(oldKey);
    if (oldData && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, oldData);
      // console.log(`Migrated ${oldKey} to ${newKey}`);
    }
  });
};
