import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import "./App.css";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfYYsSm2S6gLpJcCu7wLoEdpgAftxt9DfxWnVPmqYNt9bdlkA/formResponse";

function App() {
  const [page, setPage] = useState(0);
  const googleFormRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    year: "",
    semester: "",
    interests: [],
    skillLevel: "",
    activities: [],
    contributions: [],
    phone: "",
    email: "",
  });

  const updateData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitToGoogleForm = () => {
    console.debug("Submitting Google Form:", formData);
    googleFormRef.current.submit();
    setPage(8);
  };

  return (
    <div className="app">
      <form
        ref={googleFormRef}
        action={GOOGLE_FORM_URL}
        method="POST"
        target="google-form-hidden-frame"
        style={{ display: "none" }}
      >
        <input name="entry.590781361" value={formData.name} readOnly />
        <input name="entry.392658492" value={formData.year} readOnly />
        <input
          name="entry.2041580082"
          value={formData.semester}
          readOnly
        />
        {formData.interests.map((item) => (
          <input
            key={`interest-${item}`}
            name="entry.1472901316"
            value={item}
            readOnly
          />
        ))}
        <input
          name="entry.1200873607"
          value={formData.skillLevel}
          readOnly
        />
        {formData.activities.map((item) => (
          <input
            key={`activity-${item}`}
            name="entry.289437916"
            value={item}
            readOnly
          />
        ))}
        {formData.contributions.map((item) => (
          <input
            key={`contribution-${item}`}
            name="entry.901751509"
            value={item}
            readOnly
          />
        ))}
        <input name="entry.1020062477" value={formData.phone} readOnly />
        <input name="entry.841494470" value={formData.email} readOnly />
      </form>
      <iframe
        name="google-form-hidden-frame"
        title="Google Forms submission"
        style={{ display: "none" }}
      />
      <AnimatePresence mode="wait">

        {/* LANDING PAGE */}
        {page === 0 && (
          <LandingPage
            key="landing"
            onStart={() => setPage(1)}
          />
        )}

        {/* QUESTION 01 */}
        {page === 1 && (
          <QuestionOne
            key="question-one"
            data={formData}
            updateData={updateData}
            onNext={() => setPage(2)}
            onBack={() => setPage(0)}
          />
        )}

        {/* QUESTION 02 */}
        {page === 2 && (
          <QuestionTwo
            key="question-two"
            data={formData}
            updateData={updateData}
            onNext={() => setPage(3)}
            onBack={() => setPage(1)}
          />
        )}

        {/* QUESTION 03 */}
        {page === 3 && (
          <QuestionThree
            key="question-three"
            data={formData}
            updateData={updateData}
            onNext={() => setPage(4)}
            onBack={() => setPage(2)}
          />
        )}
        

        {page === 4 && (
  <QuestionFour
    key="question-four"
    data={formData}
    updateData={updateData}
    onNext={() => setPage(5)}
    onBack={() => setPage(3)}
  />
)}
{page === 5 && (
  <QuestionFive
    key="question-five"
    data={formData}
    updateData={updateData}
    onNext={() => setPage(6)}
    onBack={() => setPage(4)}
  />
)}
{page === 6 && (
  <QuestionSix
    key="question-six"
    data={formData}
    updateData={updateData}
    onNext={() => setPage(7)}
    onBack={() => setPage(5)}
  />
)}
{page === 7 && (
  <ContactPage
    key="contact"
    data={formData}
    updateData={updateData}
    onNext={submitToGoogleForm}
    onBack={() => setPage(6)}
  />
)}
{page === 8 && (
  <FinalPage
    key="final"
    data={formData}
    onRestart={() => setPage(0)}
  />
)}

      </AnimatePresence>
    </div>
  );
}


/* =========================================================
   LANDING
========================================================= */

function LandingPage({ onStart }) {
  return (
    <motion.main
      className="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.45 }}
    >

      <header className="header">

        <div className="brand">
          BCA <span>/</span> TECH COMMUNITY
        </div>

        <div className="edition">
          2026
        </div>

      </header>


      <section className="hero">

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          SOMETHING NEW IS BEING BUILT.
        </motion.p>


        <div className="title">

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            LET'S BUILD
          </motion.h1>


          <motion.div
            className="together"
            initial={{
              opacity: 0,
              x: -30,
              scaleX: 0.85,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scaleX: 1,
            }}
            transition={{ delay: 0.55 }}
          >
            <span>TOGETHER.</span>
          </motion.div>


          <motion.div
            className="sticker"
            initial={{
              opacity: 0,
              scale: 0,
              rotate: -20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 7,
            }}
            transition={{
              delay: 0.9,
              type: "spring",
              stiffness: 180,
            }}
          >
            <span>STUDENTS</span>
            <strong>×</strong>
            <span>TECH</span>
          </motion.div>

        </div>


        <motion.p
          className="description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          A student-driven space to learn, experiment, build
          <br />
          projects, explore new technology and have a little fun
          <br />
          while we're at it.
        </motion.p>


        <motion.div
          className="small-line"
          initial={{ width: 0 }}
          animate={{ width: 90 }}
          transition={{ delay: 1.15 }}
        />


        <motion.button
          className="cta"
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 }}
          whileHover={{
            y: -5,
            x: 2,
          }}
          whileTap={{
            y: 3,
            x: 3,
          }}
        >
          <span>I'M CURIOUS</span>
          <ArrowRight size={24} />
        </motion.button>

      </section>


      <footer className="footer">

        <span>ADP COLLEGE</span>

        <div>
          LEARN × BUILD × EXPERIMENT × GROW
        </div>

        <span>BCA / 2026</span>

      </footer>

    </motion.main>
  );
}


/* =========================================================
   QUESTION ONE
========================================================= */

function QuestionOne({
  data,
  updateData,
  onNext,
  onBack,
}) {
  const canContinue =
    data.name.trim().length > 0;

  return (
    <QuestionLayout
      step="01"
      onBack={onBack}
      progress="16.6%"
    >

      <div className="question-intro">

        <p>// FIRST THINGS FIRST</p>

        <h2>
          EVERY BUILDER
          <br />
          <span>STARTS SOMEWHERE.</span>
        </h2>

        <div className="question-note">
          No experience required.
          <br />
          Just bring your curiosity.
        </div>

      </div>


      <motion.div
        className="form-card"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
      >

        <div className="number">
          01
        </div>

        <label>
          WHAT'S YOUR NAME?
        </label>

        <input
          value={data.name}
          onChange={(e) =>
            updateData(
              "name",
              e.target.value
            )
          }
          placeholder="Enter your name..."
          autoFocus
        />

        <button
          className="next"
          disabled={!canContinue}
          onClick={onNext}
        >
          NEXT
          <ArrowRight size={21} />
        </button>

      </motion.div>

    </QuestionLayout>
  );
}


/* =========================================================
   QUESTION TWO
========================================================= */

function QuestionTwo({
  data,
  updateData,
  onNext,
  onBack,
}) {
  const years = [
    {
      label: "1ST YEAR",
      value: "1st year",
      description: "Just getting started",
    },
    {
      label: "2ND YEAR",
      value: "2nd year",
      description: "Building momentum",
    },
    {
      label: "3RD YEAR",
      value: "3rd year",
      description: "Ready to build",
    },
  ];

  const semesters = {
    "1st year": [
      "Semester 1",
      "Semester 2",
    ],

    "2nd year": [
      "Semester 3",
      "Semester 4",
    ],

    "3rd year": [
      "Semester 5",
      "Semester 6",
    ],
  };

  const currentSemesters =
    semesters[data.year] || [];

  const canContinue =
    data.year && data.semester;

  return (
    <QuestionLayout
      step="02"
      onBack={onBack}
      progress="33.3%"
    >

      <div className="question-intro">

        <p>// KNOW YOUR STARTING POINT</p>

        <h2>
          WHERE ARE YOU
          <br />
          <span>IN YOUR JOURNEY?</span>
        </h2>

        <div className="question-note">
          Everyone starts somewhere.
          <br />
          Tell us where you're at.
        </div>

      </div>


      <motion.div
        className="form-card selection-card"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
      >

        <div className="number">
          02
        </div>


        <label>
          YOUR YEAR
        </label>


        <div className="option-grid">

          {years.map((year) => (

            <motion.button
              key={year.value}
              className={`option ${
                data.year === year.value
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                updateData(
                  "year",
                  year.value
                );

                updateData(
                  "semester",
                  ""
                );
              }}
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >

              <strong>
                {year.label}
              </strong>

              <small>
                {year.description}
              </small>

            </motion.button>

          ))}

        </div>


        <AnimatePresence>

          {data.year && (

            <motion.div
              className="semester-section"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
            >

              <label>
                CURRENT SEMESTER
              </label>


              <div className="semester-grid">

                {currentSemesters.map(
                  (semester) => (

                    <motion.button
                      key={semester}
                      className={`semester ${
                        data.semester === semester
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateData(
                          "semester",
                          semester
                        )
                      }
                      whileHover={{
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >
                      {semester}
                    </motion.button>

                  )
                )}

              </div>

            </motion.div>

          )}

        </AnimatePresence>


        <motion.button
          className="next"
          disabled={!canContinue}
          onClick={onNext}
          animate={{
            opacity:
              canContinue
                ? 1
                : 0.45,
          }}
        >
          NEXT
          <ArrowRight size={21} />
        </motion.button>

      </motion.div>

    </QuestionLayout>
  );
}


/* =========================================================
   QUESTION THREE — INTERESTS
========================================================= */

function QuestionThree({
  data,
  updateData,
  onNext,
  onBack,
}) {
  const interests = [
    { label: "WEB DEVELOPMENT", value: "WEB DEVELOPMENT" },
    { label: "APP DEVELOPMENT", value: "APP DEVELOPMENT" },
    { label: "AI / ML", value: "AI/ML" },
    { label: "CYBERSECURITY", value: "CYBERSECURITY" },
    { label: "UI / UX", value: "UI/UX" },
    { label: "DATA SCIENCE", value: "DATA SCIENCE" },
    { label: "CLOUD", value: "CLOUD" },
    { label: "OPEN SOURCE", value: "OPEN SOURCE" },
    { label: "GAME DEVELOPMENT", value: "GAME DEVELOPMENT" },
    { label: "I'M NOT SURE YET", value: "I'M NOT SURE YET" },
  ];


  const toggleInterest = (interest) => {
    if (
      data.interests.includes(interest.value)
    ) {
      updateData(
        "interests",
        data.interests.filter(
          (item) => item !== interest.value
        )
      );
    } else {
      updateData(
        "interests",
        [
          ...data.interests,
          interest.value,
        ]
      );
    }
  };


  const canContinue =
    data.interests.length > 0;


  return (
    <QuestionLayout
      step="03"
      onBack={onBack}
      progress="50%"
    >

      <div className="question-intro">

        <p>// FOLLOW YOUR CURIOSITY</p>

        <h2>
          WHAT MAKES
          <br />
          <span>YOU CURIOUS?</span>
        </h2>

        <div className="question-note">
          Pick everything that sounds interesting.
          <br />
          There are no wrong answers.
        </div>

      </div>


      <motion.div
        className="form-card interests-card"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
      >

        <div className="number">
          03
        </div>


        <label>
          I'M INTERESTED IN...
        </label>


        <div className="interest-grid">

          {interests.map(
            (interest, index) => {

              const selected =
                data.interests.includes(
                  interest.value
                );

              return (
                <motion.button
                  key={interest.value}
                  className={`interest-option ${
                    selected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleInterest(
                      interest
                    )
                  }
                  whileHover={{
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.04,
                  }}
                >

                  <span>
                    {selected
                      ? "✓"
                      : "+"}
                  </span>

                  {interest.label}

                </motion.button>
              );
            }
          )}

        </div>


        <div className="selected-count">
          {data.interests.length > 0
            ? `${data.interests.length} SELECTED`
            : "SELECT AT LEAST ONE"}
        </div>


        <motion.button
          className="next"
          disabled={!canContinue}
          onClick={onNext}
          animate={{
            opacity:
              canContinue
                ? 1
                : 0.45,
          }}
        >
          NEXT
          <ArrowRight size={21} />
        </motion.button>

      </motion.div>

    </QuestionLayout>
  );
}

/* =========================================================
   QUESTION FOUR — SKILL LEVEL
========================================================= */

function QuestionFour({
  data,
  updateData,
  onNext,
  onBack,
}) {
  const skillLevels = [
    {
      title: "JUST STARTING",
      value: "JUST STARTING — I'm completely new",
      description: "I'm completely new",
    },
    {
      title: "LEARNING",
      value: "LEARNING — I've tried a few things",
      description: "I've tried a few things",
    },
    {
      title: "BUILDING",
      value: "BUILDING — I've made some projects",
      description: "I've made some projects",
    },
    {
      title: "COMFORTABLE",
      value: "COMFORTABLE — I can build things on my own",
      description: "I can build things on my own",
    },
    {
      title: "EXPLORING",
      value: "EXPLORING — I want to go deeper",
      description: "I want to go deeper",
    },
  ];

  const canContinue = data.skillLevel !== "";

  return (
    <QuestionLayout
      step="04"
      progress="66.6%"
      onBack={onBack}
    >
      <div className="question-intro">
        <p>// NO JUDGEMENT HERE</p>

        <h2>
          HOW COMFORTABLE
          <br />
          <span>ARE YOU WITH TECH?</span>
        </h2>

        <div className="question-note">
          There is no right answer.
          <br />
          Just tell us where you are.
        </div>
      </div>

      <motion.div
        className="form-card selection-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="number">
          04
        </div>

        <label>
          YOUR CURRENT LEVEL
        </label>

        <div className="skill-grid">
          {skillLevels.map((level, index) => {
            const selected =
              data.skillLevel === level.value;

            return (
              <motion.button
                key={level.title}
                className={`skill-option ${
                  selected ? "selected" : ""
                }`}
                onClick={() =>
                  updateData(
                    "skillLevel",
                    level.value
                  )
                }
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.07,
                }}
              >
                <div className="skill-number">
                  0{index + 1}
                </div>

                <div className="skill-text">
                  <strong>
                    {level.title}
                  </strong>

                  <small>
                    {level.description}
                  </small>
                </div>

                <span className="skill-check">
                  {selected ? "✓" : "→"}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          className="next"
          disabled={!canContinue}
          onClick={onNext}
          animate={{
            opacity: canContinue ? 1 : 0.45,
          }}
        >
          NEXT
          <ArrowRight size={21} />
        </motion.button>
      </motion.div>
    </QuestionLayout>
  );
}
/* =========================================================
   QUESTION FIVE — 
========================================================= */
function QuestionFive({
  data,
  updateData,
  onNext,
  onBack,
}) {
  const activities = [
    { label: "BUILD PROJECTS", value: "Build projects" },
    { label: "JOIN HACKATHONS", value: "Join hackathons" },
    { label: "LEARN TO CODE", value: "Learn to code" },
    { label: "BUILD AI / ML MODELS", value: "Build ai/ml models" },
    { label: "WORK WITH OTHERS", value: "Work with others" },
    { label: "ATTEND TECH EVENTS", value: "Attend tech events" },
    { label: "EXPLORE NEW TECHNOLOGY", value: "Explore new technology" },
    { label: "SHARE WHAT I KNOW", value: "Share what I know" },
    { label: "I'M NOT SURE YET", value: "I'm not sure yet" },
  ];

  const toggleActivity = (activity) => {
    if (data.activities.includes(activity.value)) {
      updateData(
        "activities",
        data.activities.filter(
          (item) => item !== activity.value
        )
      );
    } else {
      updateData(
        "activities",
        [...data.activities, activity.value]
      );
    }
  };

  const canContinue =
    data.activities.length > 0;

  return (
    <QuestionLayout
      step="05"
      progress="83.3%"
      onBack={onBack}
    >
      <div className="question-intro">
        <p>// MAKE IT YOUR OWN</p>

        <h2>
          WHAT DO YOU
          <br />
          <span>WANT TO DO?</span>
        </h2>

        <div className="question-note">
          Pick everything you'd be excited to try.
          <br />
          There are no wrong answers.
        </div>
      </div>

      <motion.div
        className="form-card activities-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="number">
          05
        </div>

        <label>
          I'D LIKE TO...
        </label>

        <div className="interest-grid">
          {activities.map((activity, index) => {
            const selected =
              data.activities.includes(activity.value);

            return (
              <motion.button
                  key={activity.value}
                className={`interest-option ${
                  selected ? "selected" : ""
                }`}
                onClick={() =>
                  toggleActivity(activity)
                }
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.04,
                }}
              >
                <span>
                  {selected ? "✓" : "+"}
                </span>

                {activity.label}
              </motion.button>
            );
          })}
        </div>

        <div className="selected-count">
          {data.activities.length > 0
            ? `${data.activities.length} SELECTED`
            : "SELECT AT LEAST ONE"}
        </div>

        <motion.button
          className="next"
          disabled={!canContinue}
          onClick={onNext}
          animate={{
            opacity: canContinue ? 1 : 0.45,
          }}
        >
          NEXT
          <ArrowRight size={21} />
        </motion.button>
      </motion.div>
    </QuestionLayout>
  );
}
/* =========================================================
   QUESTION SIX— 
========================================================= */
function QuestionSix({
  data,
  updateData,
  onNext,
  onBack,
}) {
  const contributions = [
    { label: "CODING", value: "Coding" },
    { label: "DESIGN / UI", value: "Design/ui" },
    { label: "IDEAS & BRAINSTORMING", value: "Ideas and brain storming" },
    { label: "PRESENTING / SPEAKING", value: "Presenting/ Speaking" },
    { label: "CONTENT / SOCIAL MEDIA", value: "Content/ Social media" },
    { label: "WRITING / DOCUMENTATION", value: "Writing/ Documentation" },
    { label: "TEAM COORDINATION", value: "Team Coordination" },
    { label: "RESEARCH & EXPLORATION", value: "Research & Exploration" },
    { label: "I'M NOT SURE YET", value: "I'm not sure yet" },
  ];

  const toggleContribution = (contribution) => {
    if (
      data.contributions.includes(contribution.value)
    ) {
      updateData(
        "contributions",
        data.contributions.filter(
          (item) => item !== contribution.value
        )
      );
    } else {
      updateData(
        "contributions",
        [
          ...data.contributions,
          contribution.value,
        ]
      );
    }
  };

  const canContinue =
    data.contributions.length > 0;

  return (
    <QuestionLayout
      step="06"
      progress="100%"
      onBack={onBack}
    >
      <div className="question-intro">
        <p>// EVERYONE HAS SOMETHING TO BRING</p>

        <h2>
          HOW CAN YOU
          <br />
          <span>CONTRIBUTE?</span>
        </h2>

        <div className="question-note">
          You don't need to be an expert.
          <br />
          Pick what feels like you.
        </div>
      </div>

      <motion.div
        className="form-card contributions-card"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.15,
        }}
      >
        <div className="number">
          06
        </div>

        <label>
          I CAN HELP WITH...
        </label>

        <div className="interest-grid">
          {contributions.map(
            (contribution, index) => {
              const selected =
                  data.contributions.includes(
                  contribution.value
                );

              return (
                <motion.button
                  key={contribution.value}
                  className={`interest-option ${
                    selected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleContribution(
                      contribution
                    )
                  }
                  whileHover={{
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.04,
                  }}
                >
                  <span>
                    {selected ? "✓" : "+"}
                  </span>

                  {contribution.label}
                </motion.button>
              );
            }
          )}
        </div>

        <div className="selected-count">
          {data.contributions.length > 0
            ? `${data.contributions.length} SELECTED`
            : "SELECT AT LEAST ONE"}
        </div>

        <motion.button
          className="next"
          disabled={!canContinue}
          onClick={onNext}
          animate={{
            opacity: canContinue
              ? 1
              : 0.45,
          }}
        >
          FINISH
          <ArrowRight size={21} />
        </motion.button>
      </motion.div>
    </QuestionLayout>
  );
}

/* =========================================================
   FINAL — CONTACT DETAILS
========================================================= */

function ContactPage({
  data,
  updateData,
  onNext,
  onBack,
}) {
  const phoneValid =
    /^[0-9]{10}$/.test(data.phone);

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      data.email
    );

  const canContinue =
    phoneValid && emailValid;

  return (
    <motion.main
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5 }}
    >

      {/* TOP */}

      <header className="contact-header">

        <button onClick={onBack}>
          ← BACK
        </button>

        <span>
          FINAL STEP
        </span>

      </header>


      {/* MAIN */}

      <section className="contact-content">

        <motion.div
          className="contact-intro"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
        >

          <p>// ONE LAST THING</p>

          <h1>
            <span className="stay-text">LET'S STAY</span>
            <br />

            <span>CONNECTED.</span>
          </h1>

          <div className="contact-note">
            Drop your contact details so we can
            <br />
            keep you updated about what's coming.
          </div>

        </motion.div>


        {/* FORM */}

        <motion.div
          className="contact-card"
          initial={{
            opacity: 0,
            y: 40,
            rotate: 1,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
        >

          <div className="contact-number">
            07
          </div>


          {/* PHONE */}

          <div className="contact-field">

            <label>
              PHONE NUMBER
            </label>

            <div className="input-wrapper">

              <span>
                +91
              </span>

              <input
                type="tel"
                inputMode="numeric"
                maxLength="10"
                value={data.phone}
                onChange={(e) =>
                  updateData(
                    "phone",
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="9876543210"
              />

            </div>

          </div>


          {/* EMAIL */}

          <div className="contact-field">

            <label>
              EMAIL ADDRESS
            </label>

            <input
              type="email"
              value={data.email}
              onChange={(e) =>
                updateData(
                  "email",
                  e.target.value
                )
              }
              placeholder="you@example.com"
            />

          </div>


          {/* BUTTON */}

          <motion.button
            className="submit-button"
            disabled={!canContinue}
            onClick={onNext}
            whileHover={
              canContinue
                ? {
                    y: -4,
                    x: 2,
                  }
                : {}
            }
            whileTap={
              canContinue
                ? {
                    y: 3,
                    x: 3,
                  }
                : {}
            }
          >

            <span>
              FINISH
            </span>

            <ArrowRight size={23} />

          </motion.button>

        </motion.div>

      </section>


      {/* BOTTOM */}

      <motion.div
        className="contact-footer"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.7,
        }}
      >
        YOUR DETAILS STAY WITH THE COMMUNITY
      </motion.div>

    </motion.main>
  );
}
/* =========================================================
   FINAL PAGE — YOU'RE IN
========================================================= */

function FinalPage({ data, onRestart }) {
  return (
    <motion.main
      className="final-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* TOP LABEL */}

      <motion.div
        className="final-top"
        initial={{
          opacity: 0,
          y: -30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.5,
        }}
      >
        BCA / TECH COMMUNITY
        <span>2026</span>
      </motion.div>


      {/* MAIN */}

      <div className="final-center">

        {/* YOU'RE */}

        <motion.div
          className="final-word youre"
          initial={{
            opacity: 0,
            y: -180,
            rotate: -4,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
          }}
          transition={{
            delay: 0.25,
            duration: 0.8,
            type: "spring",
            stiffness: 90,
            damping: 12,
          }}
        >
          YOU'RE
        </motion.div>


        {/* IN */}

        <motion.div
          className="final-word in"
          initial={{
            opacity: 0,
            y: -220,
            rotate: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
          }}
          transition={{
            delay: 0.48,
            duration: 0.85,
            type: "spring",
            stiffness: 85,
            damping: 11,
          }}
        >
          IN.
        </motion.div>


        {/* CONFIRMATION */}

        <motion.div
          className="final-confirmation"
          initial={{
            opacity: 0,
            y: -80,
            scale: 0.7,
            rotate: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 2,
          }}
          transition={{
            delay: 0.9,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
        >
          <span className="final-check">
            ✓
          </span>

          <div>
            <strong>
              RESPONSE RECEIVED
            </strong>

            <small>
              THANKS, {data.name.toUpperCase()}
            </small>
          </div>
        </motion.div>


        {/* MESSAGE */}

        <motion.p
          className="final-message"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.2,
            duration: 0.5,
          }}
        >
          Something interesting is being built.
          <br />
          And you're now part of it.
        </motion.p>


        {/* TAGS */}

        <motion.div
          className="final-tags"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.4,
          }}
        >
          <span>LEARN</span>
          <span>BUILD</span>
          <span>EXPERIMENT</span>
          <span>GROW</span>
        </motion.div>


        {/* BUTTON */}

        <motion.button
          className="final-button"
          onClick={onRestart}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.65,
          }}
          whileHover={{
            y: -4,
            x: 2,
          }}
          whileTap={{
            y: 3,
            x: 3,
          }}
        >
          BACK TO START
          <ArrowRight size={21} />
        </motion.button>

      </div>


      {/* BOTTOM */}

      <motion.div
        className="final-bottom"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.8,
        }}
      >
        ADP COLLEGE
        <span>×</span>
        BCA 2026
      </motion.div>

    </motion.main>
  );
}
/* =========================================================
   SHARED QUESTION LAYOUT
========================================================= */

function QuestionLayout({
  children,
  step,
  progress,
  onBack,
}) {
  return (
    <motion.main
      className="question-page"
      initial={{
        opacity: 0,
        x: 80,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -80,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >

      <header className="question-header">

        <button onClick={onBack}>
          ← BACK
        </button>

        <span>
          STEP{" "}
          <strong>{step}</strong>
          {" "} / 06
        </span>

      </header>


      <div className="progress">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: progress,
          }}
          transition={{
            duration: 0.7,
          }}
        />

      </div>


      <section className="question-content">
        {children}
      </section>

    </motion.main>
  );
}


export default App;