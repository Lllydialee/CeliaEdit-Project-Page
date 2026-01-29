// ---- Resources (top icon buttons) ----
window.PROJECT_DATA = {
  resources: [
    { label: "Paper", url: "https://arxiv.org/abs/xxxx.xxxxx", icon: "paper" },
    { label: "Code", url: "https://github.com/your/repo", icon: "code" },
    { label: "Hugging Face", url: "https://huggingface.co/your/model", icon: "hf" },
    { label: "Dataset", url: "https://huggingface.co/datasets/your/ds", icon: "db" }
  ],

  // ---- Generation: Instruct Image Generation ----
  genImages: [
    {
      title: "Case 01",
      media: "assets/img/gen_01.jpg",
      prompt: "A cinematic product shot of a porcelain teacup on a reflective table, soft rim light, shallow depth of field."
    },
    {
      title: "Case 02",
      media: "assets/img/gen_02.jpg",
      prompt: "A stylized character portrait, studio lighting, crisp linework, subtle film grain."
    }
  ],

  // ---- Generation: Instruct Video Generation ----
  genVideos: [
    {
      title: "Case 01",
      media: "assets/vid/gen_01.mp4",
      prompt: "A drone-like forward dolly through a neon night market; subtle crowd motion; wet ground reflections; moody teal-magenta grade."
    }
  ],

  // ---- In-Context Generation (UniVideo-like layout) ----
  inContextGen: [
    {
      refs: ["assets/img/ref_01a.jpg", "assets/img/ref_01b.jpg"],
      outputVideo: "assets/vid/ctxgen_01.mp4",
      instruction: "Two researchers discuss quietly in a high-tech lab; cool daylight, gentle camera drift."
    }
  ],

  // ---- Image Editing (before/after slider) ----
  imageEdits: [
    {
      title: "Local Edit 01",
      before: "assets/img/edit_img_01_before.jpg",
      after:  "assets/img/edit_img_01_after.jpg",
      prompt: "Add a small golden pin to the jacket collar; keep lighting and background unchanged."
    }
  ],

  // ---- Video Editing blocks (task-filtered) ----
  videoEditTasks: ["All", "Add", "Remove", "Local Change", "Global Change", "Dynamic Edit"],

  videoEdits: [
    {
      task: "Add",
      src: "assets/vid/edit_src_01.mp4",
      out: "assets/vid/edit_out_01.mp4",
      prompt: "Add a red scarf around the dog’s neck, perfectly tracked across frames. Keep everything else unchanged."
    },
    {
      task: "Global Change",
      src: "assets/vid/edit_src_02.mp4",
      out: "assets/vid/edit_out_02.mp4",
      prompt: "Transform the overall color grading into a warm sunset look while preserving motion and identity."
    }
  ],

  // ---- In-Context Editing ----
  inContextEdits: [
    {
      refs: ["assets/img/ctxedit_ref_01.jpg"],
      outputVideo: "assets/vid/ctxedit_01.mp4",
      instruction: "Use the reference object style and apply it to the target while preserving camera motion."
    }
  ],

  // ---- Re-cam ----
  recam: [
    {
      refVideo: "assets/vid/recam_ref_01.mp4",
      oriVideo: "assets/vid/recam_ori_01.mp4",
      outVideo: "assets/vid/recam_out_01.mp4",
      instruction: "Apply the camera motion pattern from the reference video onto the original scene."
    }
  ]
};