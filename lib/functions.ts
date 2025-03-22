const formatDateToDDMMYYYY = (date: unknown): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error("formatDateToDDMMYYYY: Fecha inválida", date);
        return "Fecha inválida";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export { formatDateToDDMMYYYY }