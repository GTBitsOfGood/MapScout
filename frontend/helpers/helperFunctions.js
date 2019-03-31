
// Get and format date
export function getDate(date) {
  var issueDate = new Date(date);
  Date.prototype.mmddyyyy = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate() + 1;
    var yyyy = this.getFullYear().toString();
    var yy = yyyy.substring(2, 4);
    return [
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd,
      yy
    ].join('/');
  };
  return issueDate.mmddyyyy();
}
