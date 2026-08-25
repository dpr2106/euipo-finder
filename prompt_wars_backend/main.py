from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import itertools
import random

app = FastAPI(
    title="SYNAPSE // MatchForge Engine",
    description="Autonomous Team Formation & Algorithmic Synergy Intelligence API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- DATA MODELS -----------------

class Builder(BaseModel):
    id: str
    name: str
    avatar: str
    role_title: str
    primary_category: str  # "Frontend", "Backend", "AI / ML", "UI / UX Design", "Pitch & Biz", "Hardware / IoT"
    bio: str
    skills: List[str]
    skill_scores: Dict[str, int]  # {"frontend": 80, "backend": 40, "ai_data": 20, "design_ux": 90, "pitch_biz": 60}
    experience_years: int
    experience_level: str  # "Beginner", "Intermediate", "Advanced", "Veteran"
    availability_hours_per_week: int
    timezone: str
    interests: List[str]
    hackathons_won: int = 0
    github_handle: Optional[str] = None
    portfolio_url: Optional[str] = None
    open_for_teams: bool = True

class Project(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    category: str
    target_hackathon: str
    required_roles: List[str]
    required_skills: List[str]
    min_hours_per_week: int
    creator_id: str
    created_at: str
    members: List[str] = []
    applicants: List[Dict[str, Any]] = []

class SynergyRequest(BaseModel):
    builder_ids: List[str]
    project_category: Optional[str] = "General Hackathon"
    required_skills: Optional[List[str]] = []

class AutoSquadRequest(BaseModel):
    project_title: str
    project_description: str
    category: str
    team_size: int = 4
    required_roles: List[str]
    required_skills: List[str]
    min_hours_per_week: int = 15

# ----------------- INITIAL IN-MEMORY DATABASE -----------------

INITIAL_BUILDERS: List[Dict[str, Any]] = [
    {
        "id": "b1",
        "name": "Aarav Sharma",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "role_title": "AI & Agentic Systems Engineer",
        "primary_category": "AI / ML",
        "bio": "Building autonomous multi-agent pipelines and LLM inference engines. 3x Hackathon Winner.",
        "skills": ["Python", "FastAPI", "PyTorch", "LangChain", "RAG", "ChromaDB"],
        "skill_scores": {"frontend": 45, "backend": 88, "ai_data": 98, "design_ux": 30, "pitch_biz": 65},
        "experience_years": 3,
        "experience_level": "Advanced",
        "availability_hours_per_week": 25,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Agentic AI", "LegalTech", "Computer Vision"],
        "hackathons_won": 3,
        "github_handle": "aarav-ai",
        "portfolio_url": "https://aarav.dev",
        "open_for_teams": True
    },
    {
        "id": "b2",
        "name": "Diya Nair",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "role_title": "Lead Product & Interaction Designer",
        "primary_category": "UI / UX Design",
        "bio": "Obsessed with micro-interactions, dark mode aesthetics, dynamic design systems, and Figma tokens.",
        "skills": ["Figma", "UI/UX", "Design Systems", "Prototyping", "Tailwind CSS", "Motion Design"],
        "skill_scores": {"frontend": 75, "backend": 20, "ai_data": 25, "design_ux": 98, "pitch_biz": 70},
        "experience_years": 4,
        "experience_level": "Veteran",
        "availability_hours_per_week": 20,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Spatial UI", "SaaS Tools", "Accessibility"],
        "hackathons_won": 4,
        "github_handle": "diyanair-design",
        "portfolio_url": "https://diyanair.design",
        "open_for_teams": True
    },
    {
        "id": "b3",
        "name": "Rohan Deshmukh",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "role_title": "Fullstack Cloud & Distributed Systems Dev",
        "primary_category": "Backend",
        "bio": "Scalable REST & GraphQL microservices, Docker, Redis, and high-concurrency systems.",
        "skills": ["Go", "Node.js", "PostgreSQL", "Docker", "FastAPI", "WebSockets"],
        "skill_scores": {"frontend": 65, "backend": 95, "ai_data": 50, "design_ux": 35, "pitch_biz": 50},
        "experience_years": 3,
        "experience_level": "Advanced",
        "availability_hours_per_week": 30,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Distributed Systems", "Cloud Native", "Fintech"],
        "hackathons_won": 2,
        "github_handle": "rohand-dev",
        "portfolio_url": "https://rohan.build",
        "open_for_teams": True
    },
    {
        "id": "b4",
        "name": "Sneha Kulkarni",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "role_title": "Product Strategist & Pitch Maestro",
        "primary_category": "Pitch & Biz",
        "bio": "Turns complex technical architectures into compelling 3-minute pitch decks that win judges and VC checks.",
        "skills": ["Product Strategy", "Pitch Decks", "Market Research", "Financial Modeling", "Storytelling"],
        "skill_scores": {"frontend": 30, "backend": 25, "ai_data": 40, "design_ux": 60, "pitch_biz": 96},
        "experience_years": 2,
        "experience_level": "Intermediate",
        "availability_hours_per_week": 20,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Startup Scaling", "Venture Capital", "EdTech"],
        "hackathons_won": 5,
        "github_handle": "sneha-pitch",
        "portfolio_url": "https://snehak.me",
        "open_for_teams": True
    },
    {
        "id": "b5",
        "name": "Vikram Sethi",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "role_title": "Frontend Architect & Creative Technologist",
        "primary_category": "Frontend",
        "bio": "Crafting butter-smooth 60fps web experiences using React, Three.js, Canvas, and WebGL.",
        "skills": ["React", "TypeScript", "Three.js", "WebGL", "Next.js", "Tailwind CSS"],
        "skill_scores": {"frontend": 98, "backend": 60, "ai_data": 35, "design_ux": 85, "pitch_biz": 55},
        "experience_years": 3,
        "experience_level": "Advanced",
        "availability_hours_per_week": 25,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Creative Coding", "WebGL Shaders", "Interactive Web"],
        "hackathons_won": 3,
        "github_handle": "vikram-frontend",
        "portfolio_url": "https://vikramsethi.dev",
        "open_for_teams": True
    },
    {
        "id": "b6",
        "name": "Meera Patel",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        "role_title": "Computer Vision & Edge ML Researcher",
        "primary_category": "AI / ML",
        "bio": "Specialized in OpenCV, YOLOv8, OCR pipelines, and real-time video stream analytics.",
        "skills": ["OpenCV", "YOLOv8", "PyTorch", "Python", "PaddleOCR", "Edge AI"],
        "skill_scores": {"frontend": 40, "backend": 75, "ai_data": 95, "design_ux": 25, "pitch_biz": 60},
        "experience_years": 2,
        "experience_level": "Intermediate",
        "availability_hours_per_week": 18,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Automated Inspection", "Drone Vision", "Legal Metrology"],
        "hackathons_won": 2,
        "github_handle": "meera-vision",
        "portfolio_url": "https://meerapatel.ai",
        "open_for_teams": True
    },
    {
        "id": "b7",
        "name": "Karan Singhal",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        "role_title": "Fullstack Web & Mobile Developer",
        "primary_category": "Frontend",
        "bio": "React Native + Express + PostgreSQL specialist. Builds fast MVPs in less than 24 hours.",
        "skills": ["React Native", "React", "Node.js", "Express", "PostgreSQL", "Supabase"],
        "skill_scores": {"frontend": 90, "backend": 80, "ai_data": 45, "design_ux": 70, "pitch_biz": 60},
        "experience_years": 2,
        "experience_level": "Intermediate",
        "availability_hours_per_week": 22,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Mobile Apps", "Rapid Prototyping", "E-Commerce"],
        "hackathons_won": 1,
        "github_handle": "karan-mobile",
        "portfolio_url": "https://karansinghal.com",
        "open_for_teams": True
    },
    {
        "id": "b8",
        "name": "Ananya Roy",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "role_title": "Data Engineer & Analytics Architect",
        "primary_category": "Backend",
        "bio": "High-throughput data pipelines, Apache Kafka, Spark, DuckDB, and real-time visualization dashboards.",
        "skills": ["Python", "SQL", "Kafka", "DuckDB", "FastAPI", "Data Modeling"],
        "skill_scores": {"frontend": 50, "backend": 92, "ai_data": 85, "design_ux": 35, "pitch_biz": 60},
        "experience_years": 3,
        "experience_level": "Advanced",
        "availability_hours_per_week": 20,
        "timezone": "IST (UTC+5:30)",
        "interests": ["Big Data", "Data Pipelines", "Real-Time Streaming"],
        "hackathons_won": 2,
        "github_handle": "ananya-data",
        "portfolio_url": "https://ananyaroy.tech",
        "open_for_teams": True
    }
]

INITIAL_PROJECTS: List[Dict[str, Any]] = [
    {
        "id": "p1",
        "title": "LexMetrology — AI Packaged Goods Legal Auditor",
        "tagline": "Automated Computer Vision & OCR for Legal Metrology Packaged Commodity Rules 2011 compliance",
        "description": "Building an automated regulatory checking system that scans package photos, detects mandatory declarations, measures text font heights in mm, and auto-generates legal violation notices.",
        "category": "GovTech / AI Inspection",
        "target_hackathon": "SRM Prompt Wars 2026",
        "required_roles": ["AI Vision Lead", "UI/UX Designer", "Fullstack Developer", "Domain & Pitch Expert"],
        "required_skills": ["OpenCV", "FastAPI", "React", "Figma", "OCR"],
        "min_hours_per_week": 20,
        "creator_id": "b1",
        "created_at": "2026-08-25T08:00:00Z",
        "members": ["b1", "b6"],
        "applicants": [
            {"builder_id": "b2", "role_applied": "UI/UX Designer", "status": "pending", "applied_at": "2026-08-25T08:30:00Z"},
            {"builder_id": "b5", "role_applied": "Fullstack Developer", "status": "pending", "applied_at": "2026-08-25T08:45:00Z"}
        ]
    },
    {
        "id": "p2",
        "title": "AegisHealth — Smart Clinical Triage Agent",
        "tagline": "Multi-modal EHR summarizer with autonomous clinical pathway routing",
        "description": "Reduces doctor burnout by taking patient history via audio, parsing clinical reports, and highlighting critical drug interactions with 99.4% precision.",
        "category": "HealthTech",
        "target_hackathon": "HealthHacks 2026",
        "required_roles": ["Frontend Dev", "Backend Architect", "Clinical Researcher", "Pitch Lead"],
        "required_skills": ["React", "Go", "Python", "Healthcare Data", "Pitch Decks"],
        "min_hours_per_week": 15,
        "creator_id": "b3",
        "created_at": "2026-08-25T07:30:00Z",
        "members": ["b3"],
        "applicants": [
            {"builder_id": "b4", "role_applied": "Pitch Lead", "status": "pending", "applied_at": "2026-08-25T08:15:00Z"}
        ]
    },
    {
        "id": "p3",
        "title": "HyperFlux — Spatial 3D Design Collaboration",
        "tagline": "Figma for 3D worlds with WebGL multiplayer sync and kinetic physics",
        "description": "Collaborative browser-based 3D workspace where architects and game designers collaborate in real-time with zero latency WebSockets.",
        "category": "Creative Tools / WebGL",
        "target_hackathon": "DevFest National",
        "required_roles": ["WebGL / 3D Dev", "Product Designer", "Rust / Go Backend Dev"],
        "required_skills": ["Three.js", "WebGL", "WebSockets", "Figma", "Go"],
        "min_hours_per_week": 25,
        "creator_id": "b5",
        "created_at": "2026-08-25T06:00:00Z",
        "members": ["b5", "b2"],
        "applicants": []
    }
]

# In-memory storage state
builders_db = list(INITIAL_BUILDERS)
projects_db = list(INITIAL_PROJECTS)

# ----------------- ALGORITHMIC HELPER FUNCTIONS -----------------

def calculate_synergy_metrics(builders: List[Dict[str, Any]], required_skills: Optional[List[str]] = None) -> Dict[str, Any]:
    if not builders:
        return {
            "overall_synergy": 0,
            "radar_scores": {"frontend": 0, "backend": 0, "ai_data": 0, "design_ux": 0, "pitch_biz": 0},
            "role_diversity_score": 0,
            "availability_index": 0,
            "strengths": [],
            "gaps": ["Squad is empty. Add at least 1 builder to begin analysis."],
            "recommendation": "Start by assigning a Technical Lead or Product Designer."
        }

    radar_scores = {"frontend": 0, "backend": 0, "ai_data": 0, "design_ux": 0, "pitch_biz": 0}
    
    for pillar in radar_scores.keys():
        scores_for_pillar = [b["skill_scores"].get(pillar, 0) for b in builders]
        best_score = max(scores_for_pillar) if scores_for_pillar else 0
        sorted_scores = sorted(scores_for_pillar, reverse=True)
        bonus = (sorted_scores[1] * 0.15) if len(sorted_scores) > 1 else 0
        radar_scores[pillar] = min(100, int(best_score + bonus))

    categories = [b.get("primary_category", "") for b in builders]
    unique_categories = set(categories)
    role_diversity_ratio = min(1.0, len(unique_categories) / min(4, max(1, len(builders))))
    role_diversity_score = int(role_diversity_ratio * 100)

    total_hours = sum(b.get("availability_hours_per_week", 15) for b in builders)
    target_hours = len(builders) * 20
    availability_index = min(100, int((total_hours / max(1, target_hours)) * 100))

    all_team_skills = set()
    for b in builders:
        all_team_skills.update([s.lower() for s in b.get("skills", [])])

    req_coverage_score = 100
    if required_skills:
        matched = sum(1 for req in required_skills if req.lower() in all_team_skills)
        req_coverage_score = int((matched / len(required_skills)) * 100) if required_skills else 100

    avg_radar = sum(radar_scores.values()) / 5.0
    overall_synergy = int(
        (avg_radar * 0.45) +
        (role_diversity_score * 0.25) +
        (availability_index * 0.15) +
        (req_coverage_score * 0.15)
    )
    overall_synergy = max(10, min(99, overall_synergy))

    strengths = []
    gaps = []

    if radar_scores["ai_data"] >= 80:
        strengths.append("High-tier AI / Data Science capability.")
    elif radar_scores["ai_data"] < 40:
        gaps.append("Weak AI / ML depth (Score < 40).")

    if radar_scores["design_ux"] >= 80:
        strengths.append("Exceptional UI/UX design and interaction polish.")
    elif radar_scores["design_ux"] < 45:
        gaps.append("Missing dedicated UI/UX Designer (Visuals may look generic).")

    if radar_scores["frontend"] >= 80 and radar_scores["backend"] >= 80:
        strengths.append("Full-stack engineering loop completely closed.")
    elif radar_scores["frontend"] < 50:
        gaps.append("Frontend velocity risk (Needs a React/WebGL dev).")
    elif radar_scores["backend"] < 50:
        gaps.append("Backend scalability risk (Needs API/DB architect).")

    if radar_scores["pitch_biz"] >= 75:
        strengths.append("Strong pitch, storytelling, and business model coverage.")
    elif radar_scores["pitch_biz"] < 40:
        gaps.append("Pitching & Hackathon presentation capability is vulnerable.")

    if len(builders) >= 3 and len(unique_categories) <= 1:
        gaps.append(f"⚠️ Skill redundancy: {len(builders)} members share the same primary domain ({categories[0]}).")

    if not gaps:
        gaps.append("Team has balanced coverage across all primary evaluation axes!")

    if radar_scores["design_ux"] < 45:
        recommendation = "Recruit a UI/UX Designer to dramatically boost presentation marks."
    elif radar_scores["pitch_biz"] < 45:
        recommendation = "Add a Product/Pitch Lead to ensure a winning demo narrative."
    elif overall_synergy >= 85:
        recommendation = "🔥 Elite Squad Formation! This team is primed for top placement."
    else:
        recommendation = "Invite a complementary specialist to fill the remaining coverage gaps."

    return {
        "overall_synergy": overall_synergy,
        "radar_scores": radar_scores,
        "role_diversity_score": role_diversity_score,
        "availability_index": availability_index,
        "total_committed_hours": total_hours,
        "strengths": strengths,
        "gaps": gaps,
        "recommendation": recommendation
    }

# ----------------- API ENDPOINTS -----------------

@app.get("/")
def read_root():
    return {
        "system": "SYNAPSE // MatchForge Engine",
        "status": "active",
        "algorithm_version": "2.4-synergy-matrix",
        "endpoints": ["/api/builders", "/api/projects", "/api/synergy/analyze", "/api/match/auto-squad"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "builders_count": len(builders_db), "projects_count": len(projects_db)}

@app.get("/api/builders")
def list_builders(
    category: Optional[str] = None,
    skill: Optional[str] = None,
    min_hours: Optional[int] = None,
    experience_level: Optional[str] = None,
    search: Optional[str] = None
):
    results = builders_db
    
    if category and category != "All":
        results = [b for b in results if b["primary_category"].lower() == category.lower()]
        
    if skill:
        results = [b for b in results if any(skill.lower() in s.lower() for s in b["skills"])]
        
    if min_hours:
        results = [b for b in results if b["availability_hours_per_week"] >= min_hours]
        
    if experience_level and experience_level != "All":
        results = [b for b in results if b["experience_level"].lower() == experience_level.lower()]
        
    if search:
        q = search.lower()
        results = [
            b for b in results
            if q in b["name"].lower()
            or q in b["role_title"].lower()
            or q in b["bio"].lower()
            or any(q in s.lower() for s in b["skills"])
            or any(q in i.lower() for i in b["interests"])
        ]
        
    return {"total": len(results), "builders": results}

@app.post("/api/builders")
def create_builder(builder: Builder):
    for b in builders_db:
        if b["id"] == builder.id:
            raise HTTPException(status_code=400, detail="Builder ID already exists")
    data = builder.dict()
    builders_db.append(data)
    return {"status": "created", "builder": data}

@app.get("/api/projects")
def list_projects(category: Optional[str] = None, search: Optional[str] = None):
    results = projects_db
    if category and category != "All":
        results = [p for p in results if p["category"].lower() == category.lower()]
    if search:
        q = search.lower()
        results = [
            p for p in results
            if q in p["title"].lower()
            or q in p["description"].lower()
            or any(q in s.lower() for s in p["required_skills"])
            or any(q in r.lower() for r in p["required_roles"])
        ]
    return {"total": len(results), "projects": results}

@app.post("/api/projects")
def create_project(project: Project):
    for p in projects_db:
        if p["id"] == project.id:
            raise HTTPException(status_code=400, detail="Project ID already exists")
    data = project.dict()
    projects_db.append(data)
    return {"status": "created", "project": data}

@app.post("/api/synergy/analyze")
def analyze_synergy(req: SynergyRequest):
    selected_builders = [b for b in builders_db if b["id"] in req.builder_ids]
    analysis = calculate_synergy_metrics(selected_builders, req.required_skills)
    return {
        "builder_count": len(selected_builders),
        "selected_builders": selected_builders,
        "analysis": analysis
    }

@app.post("/api/match/auto-squad")
def auto_squad_assembler(req: AutoSquadRequest):
    available_builders = [b for b in builders_db if b.get("open_for_teams", True)]
    
    if len(available_builders) < req.team_size:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough available builders in pool (need {req.team_size}, have {len(available_builders)})"
        )

    combinations = list(itertools.combinations(available_builders, req.team_size))
    scored_combinations = []

    for combo in combinations:
        combo_list = list(combo)
        metrics = calculate_synergy_metrics(combo_list, req.required_skills)
        
        total_hours = sum(b.get("availability_hours_per_week", 0) for b in combo_list)
        if total_hours < req.min_hours_per_week * req.team_size:
            metrics["overall_synergy"] = max(10, metrics["overall_synergy"] - 15)
            
        scored_combinations.append({
            "squad_id": f"squad-{random.randint(1000, 9999)}",
            "members": combo_list,
            "metrics": metrics,
            "overall_synergy": metrics["overall_synergy"],
            "rationale": f"High synergy across {len(set(b['primary_category'] for b in combo_list))} distinct disciplines with {total_hours} combined weekly hours."
        })

    scored_combinations.sort(key=lambda x: x["overall_synergy"], reverse=True)
    top_squads = scored_combinations[:3]

    return {
        "project_title": req.project_title,
        "target_category": req.category,
        "team_size": req.team_size,
        "top_squad_options": top_squads
    }

@app.post("/api/projects/{project_id}/apply")
def apply_to_project(project_id: str, payload: Dict[str, Any]):
    builder_id = payload.get("builder_id")
    role_applied = payload.get("role_applied", "General Contributor")
    
    target_project = next((p for p in projects_db if p["id"] == project_id), None)
    if not target_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    for app in target_project["applicants"]:
        if app["builder_id"] == builder_id:
            return {"status": "already_applied", "message": "You have already applied to this project"}

    target_project["applicants"].append({
        "builder_id": builder_id,
        "role_applied": role_applied,
        "status": "pending",
        "applied_at": "2026-08-25T09:30:00Z"
    })
    
    return {"status": "success", "message": "Application submitted successfully"}
