
export const getProjects = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/submissions`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

export const getProjectById = async (id) => {
  const projects = await getProjects();
  const project = projects.find(p => p._id === id);
  if (!project) throw new Error("Project not found");
  return project;
};

export const createProject = async (projectData) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
};

export const evaluateProject = async (projectId, evaluationData) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/submissions/${projectId}/evaluate`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evaluationData),
  });
  if (!response.ok) {
    throw new Error('Failed to evaluate project');
  }
  return response.json();
};
