
 // ✅ Render Field with * for Required Fields
  const RenderField = (name, label, type = "text", required = false) => (
    <div className="form-floating mb-2">
      <Field
        type={type}
        className="form-control form-control-sm"
        id={name}
        name={name}
        placeholder={label}
      />
      <label htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="text-danger small">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
