export const convertDateFormat = (dateStr) => {
    const parts = dateStr.split("-");

    if (parts.length !== 3) return "Invalid format";

    const [day, month, year] = parts;

    if (!day || !month || !year) return "Invalid date";

    return `${year}-${month}-${day}`;
}