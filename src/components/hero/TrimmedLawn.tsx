/**
 * The "after" state revealed behind the mower: a striped, freshly cut lawn.
 */
export function TrimmedLawn() {
  return (
    <div className="absolute inset-0">
      <div className="lawn-base absolute inset-0" />
      <div className="lawn-stripes absolute inset-0" />
      <div className="lawn-light absolute inset-0" />
    </div>
  );
}
