/**
 * @brief Hashing util function.
 * @file hashing.ts
 */

/**
 * Extracts the base name from a hashed name using a pattern.
 * If the pattern doesn't match, the original name is returned.
 *
 * @param hashedName - The hashed name to extract the base name from.
 * @param pattern - The pattern used to match and extract the base name.
 * @returns The base name extracted from the hashed name, or the original name if the pattern doesn't match.
 */
export function getBaseName(hashedName: string, pattern: string) {
  const regex = new RegExp(pattern) // Convert the string pattern to a regular expression
  const match = hashedName.match(regex) // Extract the wanted string using the regex
  return match ? match[1] : hashedName // If the pattern doesn't match, return the original name
}
