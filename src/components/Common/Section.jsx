import { motion } from "framer-motion"

export default function Section({ title, children, right }) {
  return (
    <motion.section
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="row" style={{ justifyContent: "space-between" }}>
        <p className="card-title">{title}</p>
        {right}
      </div>
      <div style={{ marginTop: 6 }}>{children}</div>
    </motion.section>
  )
}
