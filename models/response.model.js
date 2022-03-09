function ApiResponse(status, message) {       // Accept status and message in the constructor
    this.status = status || null;
    this.message  = message  || null;
}

ApiResponse.prototype.getStatus = function() {
    return this.status;
}

ApiResponse.prototype.setStatus = function(status) {
    this.status = status;
}

ApiResponse.prototype.getMessage = function() {
    return this.message;
}

ApiResponse.prototype.setMessage = function(message) {
    this.message = message;
}

ApiResponse.prototype.fill = function(newFields) {
    for (var field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = ApiResponse;     // Export the custom api response