import GameController from "@/app/GameControllers/GameControllerInterface";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import MCTSNode from "@/app/IA/MCTS/MCTSNode";

export class MCTS
{
  mGame: GameController;
  mMctsTree: Map<string, MCTSNode> = new Map();
  mTargetPlayer: string = "";
  mRootNodeHash: string = "";

  constructor(game: GameController)
  {
    //console.log(`MCTS: constructor`);
    this.mGame = game;
    const rootNode = new MCTSNode(this.mGame.getCurrentGameState(), "");
    this.mRootNodeHash = rootNode.getHash();
    //console.log(`MCTS: rootNodeHash: ${this.mRootNodeHash} player: ${rootNode.getState().getPlayerId()}`);
    this.mMctsTree.set(rootNode.getHash(), rootNode);
  }

  private getNode(nodeHash: string): MCTSNode
  {
    const node = this.mMctsTree.get(nodeHash);
    if (node === undefined)
    {
      throw `node ${nodeHash} not found in MCTS tree`;
    }
    return node;
  }

  private runSearch(): void
  {
    //let timerFinished = false;
    //setTimeout(() => timerFinished = true, 1000);
    const finishTime = Date.now() + 1000;
    while(Date.now() < finishTime)
    {
      const selectedNodeHash = this.selection();
      const newNodeHash = this.expand(selectedNodeHash);
      const isWinner = this.simulation(newNodeHash);
      this.backpropagation(newNodeHash, isWinner);
    }
  }

  public getBestAction(targetPlayer: string): number
  {
    //console.log(`MCTS: getBestAction`);
    //console.log(targetPlayer);
    
    this.mTargetPlayer = targetPlayer;
    this.runSearch();
    //console.log(this.mMctsTree.size);
    
    const rootNode = this.getNode(this.mRootNodeHash);

    if (rootNode.isLeaf())
    {
      throw "it is not has a best action for this state";
    }

    ////console.log(`MCTS: rootNodeHash: ${rootNode.getHash()} childrenSize: ${rootNode.getChildrenNodes().length} player: ${rootNode.getState().getPlayerId()}`);
    let bestStatistic = 0;
    let bestNode: MCTSNode | null = null;
    for (let node of rootNode.getChildrenNodes())
    {
      if (node.getSi() === 0)
      {
        throw "play not expanded";
      }
      const nodeStatistic = node.getWi() / node.getSi();
      ////console.log(`MCTS: getBestAction: ${node.getHash()} | wi: ${node.getWi()} si: ${node.getSi()}`);

      if (nodeStatistic > bestStatistic)
      {
        bestStatistic = nodeStatistic;
        bestNode = node;
      }
    }
    if (!bestNode)
    {
      throw "best node not found";
    }
    return this.getMovementPosition(rootNode, bestNode); // retornar a posição que irá ocupar
  }

  private getMovementPosition(previousNode: MCTSNode, node: MCTSNode): number
  {
    const previousBoardState = previousNode.getState().getBoardState();
    const boardState = node.getState().getBoardState();
    for (let i = 0; i < previousBoardState.length; i++)
    {
      if (previousBoardState[i] !== boardState[i])
      {
        return i;
      }
    }
    return -1;
  }

  private calculateUCB1(node: MCTSNode, parentNode: MCTSNode): number
  {
    const c = 1/Math.sqrt(2);
    const wi = node.getWi();
    const si = node.getSi();
    const sp = parentNode.getSi();
    if (si === 0)
    {
      return Infinity;
    }
    const exploitationTerm = wi / si;
    const explorationTerm = c * (Math.sqrt(Math.log(sp) / si));
    return exploitationTerm + explorationTerm;
  }

  private chooseRandomPlay(plays: GameState[]): GameState
  {
    const selectedPlayIndex = Math.floor(Math.random() * 100) % plays.length;
    ////console.log(`MCTS: chooseRandomPlay: selectedPlayIndex ${selectedPlayIndex} | playsLength: ${plays.length}`);
    return plays[selectedPlayIndex];
  }

  private selection(): string
  {
    ////console.log(`MCTS: selection`);
    let currentNode: MCTSNode = this.getNode(this.mRootNodeHash);
    while (true)
    {
      let l = currentNode.isLeaf();
      let c = !currentNode.isFullyExpanded()
      if (l || c/*currentNode.isLeaf() || !currentNode.isFullyExpanded()*/)
      {
        ////console.log(`MCTS: ${currentNode.getHash()} selection: isLeaf(): ${l} | isFullyExpanded: ${!c}`);
        const n = this.getNode(currentNode.getHash());
        ////console.log(`MCTS: ${currentNode.getHash()} selection: getChildrenNodesSize: ${currentNode.getChildrenNodes().length} | ${n.getChildrenNodes().length}`);
        let i = 0;
        for (let k of this.mMctsTree)
        {
          if (k[0] === currentNode.getHash())
          {
              i+=1;
          }
          ////console.log(`node hash; ${k}`);
        }
        ////console.log(`tree_nodes: ${this.mMctsTree.size} i: ${i}`);
        return currentNode.getHash();
      }
      let bestUcb1 = 0;
      let bestNode: MCTSNode | null = null;
      for (let candidateNode of currentNode.getChildrenNodes())
      {
        ////console.log(candidateNode);
        const ucb1Result = this.calculateUCB1(candidateNode, currentNode);
        if (ucb1Result > bestUcb1)
        {
          bestUcb1 = ucb1Result;
          bestNode = candidateNode;
        }
      }
      if (!bestNode)
      {
        throw "MCTS:selection: best action not found";
      }
      currentNode = bestNode;
    }
  }

  private expand(selectedNodeHash: string): string
  {
    //console.log(`MCTS: expand: ${selectedNodeHash}`);
    const selectedNode = this.getNode(selectedNodeHash);
    //console.log(`MCTS: ${selectedNode.getHash()} expand: getChildrenNodesSize: ${selectedNode.getChildrenNodes().length}`);
    if (selectedNode.isLeaf())
    {
      //console.log(`MCTS: ${selectedNode.getHash()} expand: isLeaf`);
      return selectedNode.getHash();
    }

    const unexpandedLegalPlays = selectedNode.getUnexpandedLegalPlays();
    const choosedPlay = this.chooseRandomPlay(unexpandedLegalPlays);

    const newNode = new MCTSNode(choosedPlay, selectedNodeHash);
    selectedNode.addChildNodeHash(newNode);
    //console.log(`expand: newNodeHash: ${newNode.getHash()}`);

    this.mMctsTree.set(newNode.getHash(), newNode);
    return newNode.getHash();
  }

  private simulation(startingNodeHash: string): boolean
  {
    ////console.log(`MCTS: simulation: startingNodeHash: ${startingNodeHash}`);
    
    const startingNode = this.getNode(startingNodeHash);
    let currentState = startingNode.getState();
    while (!currentState.isTerminal())
    {
      const legalPlays = currentState.getLegalPlays();
      ////console.log(`simulation: legalPlays: ${legalPlays}`);
      
      currentState = this.chooseRandomPlay(legalPlays);
    }
    ////console.log(`MCTS: simulation: winner: ${currentState.getWinnerPlayerId()}`);
    return currentState.getWinnerPlayerId() === this.mTargetPlayer;
  }

  private backpropagation(startingNodeHash: string, isWinner: boolean): void
  {
    ////console.log(`MCTS: backpropagation: startingNodeHash: ${startingNodeHash} | isWinner: ${isWinner}`);
    let currentNode = this.getNode(startingNodeHash);
    let i = 0;
    while(!currentNode.isRootNode())
    {
      ////console.log(`while iteration: ${++i}`);
      currentNode.setSi();
      if (isWinner)
      {
        const currentNodeIsNotWinner = currentNode.getState().getPlayerId() !== this.mTargetPlayer;
        if (currentNodeIsNotWinner)
        {
          currentNode.setWi();
        }
      }
      currentNode = this.getNode(currentNode.getParentNodeHash());
    }
    currentNode.setSi();
  }
}