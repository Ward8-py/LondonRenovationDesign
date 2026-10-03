# London Renovation Design — working instructions

## Purpose

Use the installed skills to deliver coherent, accessible, credible renovation and restoration websites. Choose skills by the actual task and output, then load only the instructions needed for the current stage. Installing a collection does not make every skill an instruction for every task.

System and developer instructions take precedence over this file. Follow the user's current request and previously accepted decisions. Within those boundaries, use this file to select skills and resolve overlapping defaults. Read a selected skill's `SKILL.md` before applying it.

## Project map and working boundaries

Confirm these paths against the current checkout before making changes:

| Location | Purpose and editing rule |
| --- | --- |
| `src/App.jsx`, `src/content.js`, `src/styles.css`, `src/main.jsx` | React landing-page components, verified business content, design tokens/styles, and client motion/hydration. Edit these source files. |
| `server/` | PHP page entry, development router, enquiry endpoint, and Apache configuration. Mail delivery is disabled unless explicitly configured on the host. |
| `public/` | Locally served brand assets, web fonts and optimised concept imagery, copied into `dist` during the build. |
| `dist/` | Generated, prerendered React landing page plus PHP deployment files. Run `npm run build`; do not hand-edit generated files. |
| `assets/` | Project assets, including concept imagery. An asset here is not automatically served by the current preview. |
| `concepts/` | Visual concepts and reference material; inspect relevant references before changing the design. |
| `amk-ionos-public-2026-09-10/` | Separate AMK website export with compiled assets. Use as context when relevant; do not mix its brand, content, or bundles into the London Renovation Design site by default. |
| `package.json`, `vite.config.js` | `npm run dev` starts React/Vite on port 5173. `npm run build` creates the production output; `npm run preview` runs PHP on port 4174. The older `preview-server.cjs` is static-only and cannot execute the PHP enquiry endpoint. |
| `research/` | Original-site archive, source/asset provenance, brand brief and validation results. Never publish this directory or use it as the web document root. |
| `archive/demo-before-react/` | Preserved original demo before the React migration. Reference only. |
| `.openai/hosting.json` | Sites hosting configuration currently points to `dist`. Use the Sites hosting workflow for publishing this Site when publication is in scope. |
| `.agents/skills/<name>/SKILL.md` | Project skill instructions and bundled references/scripts. Read these locally; do not modify third-party skill files as part of website work. |

The user requested React with PHP. The current implementation uses React/Vite, prerendered HTML, custom CSS, PHP, GSAP and one Lenis instance. Keep this stack for ordinary changes. A skill's examples are not a reason to add another framework, scrolling engine, or dependency.

The Desktop `Codex Skills Export` folder is an export copy. Use the project skill paths for work here. Leave unrelated files and existing user changes alone.

## Skill selection protocol

1. **Identify the deliverable.** Determine the target site/file, requested change, and whether the user wants analysis, a plan, implementation, or publication. Distinguish a small fix from an extension, a design-preserving redesign, or a complete overhaul.
2. **Start with one lead skill.** Choose the narrowest matching route below. For a trivial edit, ordinary repository work may need no skill. Honour explicitly requested skills and mandatory tool prerequisites.
3. **Add specialists only for a concrete need.** Normally use one lead and at most two supporting skills per stage. This is a context budget, not permission to skip required dependencies: a full `better-interface` review must load all six of its domain owners.
4. **Load progressively.** Read the selected `SKILL.md`, then only the references needed for the present decision. Do not read all 301 folders, all style recipes, or entire reference libraries. When the route is unclear, search descriptions with `rg -l -i --glob SKILL.md '<task terms>' .agents/skills`, inspect the few best matches, and choose deliberately.
5. **Check eligibility and prerequisites.** Read frontmatter, scope, invocation restrictions, required tools, and asset requirements. A familiar name alone is insufficient. A named tool or package in a downloaded skill is not evidence that it is installed or callable.
6. **Name the selection briefly.** At first use, tell the user which skill is guiding the work and why. Keep the working plan concise: target, lead skill, needed specialists, acceptance criteria.
7. **Change skill when the stage changes.** Carry forward accepted decisions and concrete findings. Avoid stacking multiple complete design workflows or restarting discovery during a small follow-up.

## Task routes

Unless explicitly marked bundled or plugin, skill names below refer to `.agents/skills/<name>/SKILL.md`. Bundled and plugin skills refer to the currently available skill catalog and must be loaded from their advertised locations.

| Task | Lead skill | Add only when needed |
| --- | --- | --- |
| Brief for a substantial new page or redesign | `design-brief` | `content-strategy` for content structure; `information-architecture` for navigation and page hierarchy. Use existing context before asking questions. |
| Build or substantially redesign an existing project web page | `web-design-engineer` | `responsive-design`, or the one relevant `better-*` specialist. Apply its extension/preserve/overhaul distinction. |
| Establish a direction from supplied visual references | `tastemaker` | Read an existing project style lock first. Use it as the direction stage, then hand the chosen direction to implementation. |
| Create a page for one offer and one primary conversion | `landing-page` | `ux-writing` for new interface copy; `form-design` for the enquiry form. Keep a multi-purpose homepage distinct from a single-offer landing page. |
| Use Elaya's complete landing-page design system | `landing-page-design` | Choose when explicitly requested or when its opinionated system fits the agreed brief. Do not combine its full visual system with another competing system. |
| Fix spacing, grouping, or responsive layout | `better-layout` | `responsive-design` for adaptive behaviour; `layout-grid` for a new grid specification. |
| Fix type hierarchy, wrapping, or readability | `better-typography` | `typography-scale` when defining a reusable type scale. |
| Fix colour usage or contrast | `better-colors` | `design-token` for token definitions; `design-token-audit` for drift in an existing token system. |
| Fix semantics, keyboard access, focus, or accessible controls | `better-accessibility` | `better-colors` for measured contrast; `form-design` for form interaction. |
| Polish an existing component | `better-ui` | `emil-design-eng` for a specific craft or interaction decision; preserve the existing visual language. |
| Write interface text / improve existing text | `ux-writing` / `better-writing`, respectively | `content-strategy` only if the content structure itself must change. |
| Design an enquiry form or booking flow | `form-design` | `error-handling-ux` or `feedback-patterns` for concrete missing states. |
| Add an animation or transition | `animate` | One implementation skill such as `gsap` or `animation-on-scroll` only if the chosen technique requires it. |
| Plan improvements to existing motion | `improve-animations` | This is an audit and planning skill. If fixes are requested too, carry its findings into an implementation stage with `animate`. |
| Fix browser animation jank or excessive resource use | `optimize-web-animations` | Measure the affected page before changing it. `performance-profiling` is for Apple apps, not this website. |
| Review an entire screen or user flow across disciplines | `better-interface` | Follow its six owners: accessibility, layout, writing, typography, colours, UI. Consolidate findings once. |
| Diagnose generic design or weak reference adaptation | `audit-ai-design-slop` | `audit-reference-originality` only for comparison against supplied references. Audit requests produce findings; implement fixes when requested. |
| Build a design acceptance checklist | `design-qa-checklist` | `usability-test-plan` only for actual usability research; a checklist does not prove checks were run. |
| Compare genuinely different solutions | `parallel-concepts` | `concept-selection` to evaluate them afterwards. The skill name alone does not request multiple agents. |
| Generate or edit bitmap imagery | Bundled `imagegen` skill and its supported tool | Existing assets first. Use `gpt-image-2` as a specialist only when its prompt guidance or runtime fits the task; do not assume external API credentials. |
| Source stock photography or reuse vector illustrations | `unsplash-asset-images` / `ideagram`, respectively | Confirm source suitability. `ideagram` requires a local unDraw library; the installation does not include that library. |
| Build a new complete website through Sites | `sites:sites-building` | One suitable design specialist. Use `sites:sites-hosting` when publishing is part of the request. |
| Create/edit a Figma file or implement a Figma design | Appropriate `figma:*` skill from the catalog | Follow the plugin's mandatory prerequisites before its tools. A local web-design skill does not replace them. |
| Create a document, spreadsheet, presentation, PDF, or video | Matching artifact/plugin skill from the catalog | Use `beautiful-article` for editorial HTML and `web-video-presentation` for recordable web presentations, rather than routing every artifact through a website workflow. |

For tasks outside this table, search the installed descriptions. Research, strategy, design-system governance, game development, Swift/mobile, and 3D material skills remain available for matching requests; they are not default steps in a renovation website task.

## Resolve overlaps before implementation

- **One visual direction:** establish one palette, type system, layout language, and motion style. Recipe skills such as `clean-minimal-beige-light-mode` or `image-first-grid-layout` are optional directions, selected from the brief. Do not mix multiple recipes because they sound premium.
- **Project decisions before generic defaults:** retain existing tokens and assets for extensions. If specialist advice conflicts with a deliberate choice, identify whether there is a functional/accessibility defect or just a preference. Change the choice only when the task warrants it.
- **Specific rule owner:** layout belongs to `better-layout`, type to `better-typography`, colour to `better-colors`, semantics and keyboard behaviour to `better-accessibility`, copy to `better-writing`, and surface polish to `better-ui`. Report a shared root cause once.
- **Explicit-only skills:** respect `disable-model-invocation: true`. Examples include `interface-review`, `review-animations`, `prototype`, `variant`, `break`, and `explain-interface`. Do not auto-invoke them merely because a broad task overlaps. Use eligible domain skills for ordinary work; use these workflows when the user explicitly invokes them.
- **Name collisions:** the project `prototype` is Emil's UI variant workflow; the separately installed personal `prototype` has a different purpose. Resolve by full path and description. Use `.agents/skills/ideagram/SKILL.md` as the canonical Ideagram entry; do not load the duplicate under `tastemaker/ideagram` as another skill.
- **Imported paths:** skills were copied out of several repository layouts. Resolve sibling references relative to the selected skill folder. If a link still names its original repository structure, locate the installed equivalent before using it; never pretend a missing reference was read.
- **Available capabilities:** inspect a script and its prerequisites before running it. Use supported tools for images, browsers, and external apps. Do not install packages, configure accounts, or write global taste profiles merely because a skill suggests them.
- **Authorisation:** preserve earlier user approval. A skill does not independently authorise publication, messages, or unrelated work. Apply only checkpoints relevant to the current scope; if a required decision is genuinely missing, explain the exact requirement and present a concrete choice or draft.

## Execution plan for substantial website work

Use these stages proportionately. A text correction or CSS fix should go straight to its relevant stage.

1. **Inspect and define success.** Read the target files, relevant references, and existing design decisions. Identify the audience, intended action, scope, constraints, and a few observable acceptance criteria. Complete this stage when the target and desired outcome are clear.
2. **Set the direction.** Reuse the current system for extensions; for a new direction, state the page structure, imagery, typography, palette, and motion decisions. If a persistent brief/style lock already exists, update that source instead of creating competing documents. Complete this stage when implementation has one consistent direction.
3. **Build the structure and real behaviour.** Implement the content hierarchy, service paths, navigation, calls to action, and form states in the current stack. Show an early usable draft for substantial design work. Complete this stage when the requested journey exists from entry to intended action.
4. **Refine with specialists.** Fix layout, mobile adaptation, readability, semantics, contrast, and copy before decorative motion. Load each specialist only as its work becomes relevant. Complete this stage when the requested surfaces are coherent and usable.
5. **Validate the changed experience.** Run checks appropriate to the change and required by the active workflow. For substantial visual changes, inspect the actual page on narrow and wide viewports, relevant interactions, keyboard focus, overflow, assets, and reduced motion. Check affected neighbouring pages when they share changed styles. Use existing project commands; do not invent an npm test/build command where no package configuration exists.
6. **Correct findings and finish.** Fix concrete failures and recheck the affected behaviour. Stop when acceptance criteria pass and material findings are resolved; do not run an endless polish loop or invent quality scores. Report what changed, where it lives, checks actually performed, and remaining limitations. Publish only when it is within the user's authorised scope.

If runtime inspection is unavailable, deliver the completed work with that limitation stated clearly. Source inspection alone cannot establish that a page renders correctly or that a real enquiry reaches its destination.

## London Renovation Design quality bar

- Preserve the current white surfaces, dark ink, red accent and locally hosted Archivo direction during extensions unless the user requests a change. The hero uses bold centred text over photography with a transparent header. Read `src/styles.css` and `research/brand-brief.md` rather than inventing replacements. Earlier serif directions are superseded.
- Keep restoration and private-renovation journeys understandable. Let visitors identify the relevant service and reach an appropriate enquiry action on mobile.
- Prefer clear service information, credible project imagery, legible text, and useful navigation over decorative effects. "Best" or "premium" does not automatically mean WebGL, cinematic scrolling, or a new animation library.
- Use the user's real brand assets and verified business facts. Do not invent client testimonials, completed projects, ratings, awards, insurance approvals, prices, accreditation, or guarantees. Keep concept imagery recognisable as concept material rather than evidence of completed work.
- Reuse tokens and shared components/styles across pages. Keep essential content and actions accessible without hover, and preserve readable layouts and understandable state changes with reduced motion.
- Do not present a placeholder contact action as a working enquiry system. Check its actual destination or submission behaviour when claiming completion of that flow.

## Maintaining this plan

Update this file when the source layout, project tooling, preferred workflow, or available skills materially change. Keep the skill library as the detailed source of instructions; this file should remain a concise selection and execution guide. Skill updates and synchronising the Desktop export are separate maintenance tasks, performed when requested.
